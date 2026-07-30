import os
import logging
import traceback
from functools import wraps
from flask import Flask, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
from flask_cors import CORS
from classes.PMCDataRetriever import PMCDataRetriever
from classes.TopicIndexer import TopicIndexer
from classes.RAGPipeline import RAGPipeline
from pathlib import Path

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def handle_endpoint_errors(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"{f.__name__} failed: {e}")
            logger.error(traceback.format_exc())
            return jsonify({"error": str(e)}), 500
    return wrapper


app = Flask(__name__)

# For React Native app - allow all origins during development
CORS(app)

try:
    logger.info("Initializing OpenAI client...")
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set")
    client = OpenAI(api_key=api_key)
    logger.info("OpenAI client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize OpenAI client: {e}")
    raise

try:
    logger.info("Initializing PMCDataRetriever...")
    ncbi_key = os.environ.get("NCBI_API_KEY")
    retriever = PMCDataRetriever(client, ncbi_api_key=ncbi_key)
    logger.info("PMCDataRetriever initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize PMCDataRetriever: {e}")
    raise

try:
    logger.info("Loading or creating article index...")
    INDEX_PATH = "pmc_index.json"
    if Path(INDEX_PATH).exists():
        logger.info(f"Loading existing index from {INDEX_PATH}")
        retriever.load_index(INDEX_PATH)
        logger.info("Index loaded successfully")
    else:
        logger.info("Creating new index with example topics...")
        retriever.search_and_index("shoulder rehabilitation stretches", max_articles=20)
        retriever.search_and_index("lower back pain physiotherapy exercises", max_articles=20)
        retriever.save_index(INDEX_PATH)
        logger.info("Index created and saved successfully")
except Exception as e:
    logger.error(f"Failed to initialize article index: {e}")
    logger.error(traceback.format_exc())
    raise

try:
    logger.info("Initializing RAG pipeline...")
    topic_indexer = TopicIndexer(retriever, client, INDEX_PATH)
    rag_pipeline = RAGPipeline(retriever, topic_indexer)
    logger.info("RAG pipeline initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize RAG pipeline: {e}")
    raise


# Test route to verify AI model and key works
@app.route("/ai-test")
@handle_endpoint_errors
def ai_test():
    response = client.responses.create(
        model="gpt-5-nano",
        instructions="You are a specialized Physiotherapy Assistant. Your goal is to provide evidence-based pain management education. Recommend stretches and exercises based on user input. Make sure responses are separated in paragraphs and easy to read.",
        input="I have a sore back. What should I do?",
    )
    return f"<p>{response.output_text}</p>"

# Gets JSON body of prompt of something stretching, physiotherapy, or pain related, depending on response_type. Returns AI response.
@app.route("/physiotherapy_advice", methods=['POST'])
@handle_endpoint_errors
def physiotherapy_advice():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    message = data.get('message', '').strip()
    if not message:
        return jsonify({"error": "Message cannot be empty"}), 400

    adviceType = data.get('advice_type', 'stretches')
    use_rag = data.get('use_rag', True)
    conversation_history = data.get('conversation_history', [])

    instructions_map = {
        'stretches': "You are a specialized Physiotherapy Assistant. Your goal is to provide evidence-based pain management education. Recommend stretches and exercises based on user input.",
        'mental': "You are a specialized Physiotherapy Assistant. Your goal is to provide evidence-based pain management education. Recommend ways to cope with the pain mentally.",
        'misc_physiotherapy': "You are a specialized Physiotherapy Assistant. Your goal is to provide evidence-based pain management education. Talk about what physiotherapists could do aside from assigning you stretches based on user input.",
    }

    if adviceType not in instructions_map:
        return jsonify({"error": f"Invalid advice_type: {adviceType}"}), 400

    extra_instructions = (
        "At the end of your response, you MUST append a JSON block using exactly this format — "
        "no markdown, no code fences, just the raw tags: "
        "<json>{ \"pain_intensity\": ..., \"primary_location\": ..., \"recommended_actions\": [...], \"red_flag_status\": ... }</json>"
    )

    rag_context = ""
    if use_rag:
        try:
            rag_context = rag_pipeline.fetch_context(message)
        except Exception as e:
            logger.warning(f"RAG context fetch failed: {e}")

    full_instructions = instructions_map.get(adviceType) + (f"\n\n{rag_context}" if rag_context else "")

    # Build input: include prior conversation turns when provided
    if conversation_history:
        input_items = [
            {"role": turn["role"], "content": turn["content"]}
            for turn in conversation_history
            if turn.get("role") in ("user", "assistant") and turn.get("content")
        ]
        input_items.append({"role": "user", "content": message})
    else:
        input_items = message

    response = client.responses.create(
        model="gpt-5-nano",
        instructions=full_instructions + " " + extra_instructions,
        input=input_items,
    )

    responseWithDataSplit = response.output_text.split('<json>')

    return {
        "message": responseWithDataSplit[0].strip(),
        'extra_data': responseWithDataSplit[1].replace('</json>', '').strip() if len(responseWithDataSplit) > 1 else ""
    }


@app.errorhandler(Exception)
def handle_error(error):
    logger.error(f"Unhandled exception: {error}")
    logger.error(traceback.format_exc())
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    logger.info("=" * 50)
    logger.info("Starting Physiotherapy AI Backend Server")
    logger.info("=" * 50)
    logger.info(f"Server running on http://0.0.0.0:8000")
    logger.info("Endpoints:")
    logger.info("  GET  /ai-test - Test the AI model")
    logger.info("  POST /physiotherapy_advice - Get physiotherapy advice")
    logger.info("=" * 50)
    app.run(host="0.0.0.0", port=8000, debug=True)