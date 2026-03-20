import os
from flask import Flask, request
from openai import OpenAI
from dotenv import load_dotenv
from flask_cors import CORS
from classes.PMCDataRetriever import PMCDataRetriever
from classes.TopicIndexer import TopicIndexer
from classes.RAGPipeline import RAGPipeline
from pathlib import Path

load_dotenv()

app = Flask(__name__)

# For React Native app - allow all origins during development
CORS(app)

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

retriever = PMCDataRetriever(client, ncbi_api_key=os.environ.get("NCBI_API_KEY"))

# On startup — saves $$ by caching embeddings
INDEX_PATH = "pmc_index.json"
if Path(INDEX_PATH).exists():
    retriever.load_index(INDEX_PATH)
else: # Initial indexing of example topics (only needs to be done once, then the index is saved and loaded on future runs)
    retriever.search_and_index("shoulder rehabilitation stretches", max_articles=20)
    retriever.search_and_index("lower back pain physiotherapy exercises", max_articles=20)
    retriever.save_index(INDEX_PATH)

topic_indexer = TopicIndexer(retriever, INDEX_PATH)
rag_pipeline = RAGPipeline(retriever, topic_indexer)


# Test route to verify AI model and key works
@app.route("/ai-test")
def ai_test():
    response = client.responses.create(
        model="gpt-5-nano",
        instructions="You are a specialized Physiotherapy Assistant. Your goal is to provide evidence-based pain management education. Recommend stretches and exercises based on user input. Make sure responses are separated in paragraphs and easy to read.",
        input="I have a sore back. What should I do?",
    )

    return f"<p>{response.output_text}</p>"

# Gets JSON body of prompt of something stretching, physiotherapy, or pain related, depending on response_type. Returns AI response.
@app.route("/physiotherapy_advice", methods=['POST'])
def physiotherapy_advice():
    data = request.get_json()  
    message = data.get('message', '')
    adviceType = data.get('advice_type', 'stretches')
    use_rag = data.get('use_rag', True)
    
    instructions_map = {
        'stretches': "You are a specialized Physiotherapy Assistant. Your goal is to provide evidence-based pain management education. Recommend stretches and exercises based on user input.",
        'mental': "You are a specialized Physiotherapy Assistant. Your goal is to provide evidence-based pain management education. Recommend ways to cope with the pain mentally.",
        'misc_physiotherapy': "You are a specialized Physiotherapy Assistant. Your goal is to provide evidence-based pain management education. Talk about what physiotherapists could do aside from assigning you stretches based on user input.",
    }

    # Extra instructions to record data that could be useful for physiotherapists to have in the response for better understanding of the patient's condition and to make more informed decisions. The JSON block will be separated from the main response by a <json> tag, which can be easily parsed on the frontend.
    extra_instructions = "At the end of your response, provide a JSON block enclosed in json tags containing: pain_intensity (1-10), primary_location, recommended_actions, and red_flag_status (boolean)."

    #Fetch RAG context of physiotherapy related articles and inject into instructions if enabled. Also ensure the message is indexed for future retrieval.
    rag_context = rag_pipeline.fetch_context(message) if use_rag else ""
    
    full_instructions = instructions_map.get(adviceType) + (f"\n\n{rag_context}" if rag_context else "")

    response = client.responses.create(
        model="gpt-5-nano",
        instructions=full_instructions + " " + extra_instructions,
        input=message,
    )
    
    responseWithDataSplit = response.output_text.split('<json>');
    
    
    return {"message": responseWithDataSplit[0], 'extra_data': responseWithDataSplit[1] if len(responseWithDataSplit) > 1 else ""}


if __name__ == '__main__':
    app.run(debug=True)