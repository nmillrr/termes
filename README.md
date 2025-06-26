#🪽 Termes: AI-Empowered Web Experience

Termes is a web app/browser extension that uses OpenAI's GPT model to summarize and clarify terms and conditions.

Copy and paste your EULA into the app, and Termes will provide the key points about the document.

## Here's how to run Termes:

1. Launch two terminal sessions; one will be used for the frontend, and the other for the backend.
2. In one session, install a few modules:
```
pip install openai flask flask-cors
```
3. Enter your OpenAI API key:
```
export OPENAI_API_KEY='your-key-here'
```
  On Windows, use:
```
set OPENAI_API_KEY=your-key-here
```
4. Run the backend:
```
python app.py
```
5. In the other session, run the frontend:
```
python -m http.server 8000
```
You should be able to access the working app at: http://localhost:8000

(Note: If you encounter an HTTPS error, it is most likely that the input was too long for the API to handle. Try shortening the input to 1000 words.)
