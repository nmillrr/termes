from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import re

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def process_summary(text):
    """Clean and format summary points into a consistent format"""
    lines = text.strip().split('\n')
    processed_points = []
    
    for line in lines:
        # Remove any kind of bullet point, number, or leading/trailing whitespace
        cleaned = re.sub(r'^[-•*]\s*|^\d+\.\s*', '', line.strip())
        if cleaned:
            # Capitalize first letter
            cleaned = cleaned[0].upper() + cleaned[1:] if cleaned else cleaned
            processed_points.append(cleaned)
    
    # Take only first 5 points
    return '\n'.join(processed_points[:5])

@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        data = request.json
        terms = data.get('terms')
        
        if not terms:
            return jsonify({'error': 'No terms provided'}), 400

        response = client.completions.create(
            model="gpt-3.5-turbo-instruct",
            prompt=f"Summarize the following terms and conditions in 5 clear key points, each less than 100 characters, prioritizing the points that are most relevant to privacy and potential rights violations:\n\n{terms}",
            max_tokens=500,
            temperature=0.7
        )

        summary = process_summary(response.choices[0].text.strip())
        return jsonify({'summary': summary}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    if not os.getenv('OPENAI_API_KEY'):
        print("Warning: OPENAI_API_KEY environment variable is not set!")
    app.run(debug=True)
