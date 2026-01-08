import os
from flask import Flask, request
from openai import OpenAI
from dotenv import load_dotenv
from flask_cors import CORS


load_dotenv()

app = Flask(__name__)

# For React Native app - allow all origins during development
CORS(app)

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

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
    
    instructions_map = {
        'stretches': "You are a specialized Physiotherapy Assistant. Your goal is to provide evidence-based pain management education. Recommend stretches and exercises based on user input.",
        'mental': "You are a specialized Physiotherapy Assistant. Your goal is to provide evidence-based pain management education. Recommend ways to cope with the pain mentally.",
        'physiotherapy': "You are a specialized Physiotherapy Assistant. Your goal is to provide evidence-based pain management education. Talk about what physiotherapists could do aside from assigning you stretches based on user input.", 

    }
    
    response = client.responses.create(
        model="gpt-5-nano",
        instructions=instructions_map.get(adviceType, instructions_map['stretches']),
        input=message,
    )
    
    return {"response": response.output_text}


if __name__ == '__main__':
    app.run(debug=True)