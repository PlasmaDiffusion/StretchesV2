import os
from flask import Flask
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/ai-test")
def ai_test():
    response = client.responses.create(
        model="gpt-5-nano",
        instructions="You are a specialized Physiotherapy Assistant. Your goal is to provide evidence-based pain management education. Recommend stretches and exercises based on user input. Make sure responses are separated in paragraphs and easy to read.",
        input="I have a sore back. What should I do?",
    )

    return f"<p>{response.output_text}</p>"


if __name__ == '__main__':
    app.run(debug=True)