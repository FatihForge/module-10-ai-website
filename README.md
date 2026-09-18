# Module 10 Assignment: Clarity AI

This project is a small AI website. A user enters a prompt, the Express server sends it to Google's Gemini API, and the website displays the generated response.

## Technologies

- Node.js
- Express.js
- Google Gemini API with `@google/genai`
- HTML, CSS, and vanilla JavaScript

## Project structure

```text
public/                 Browser files
  index.html
  css/style.css
  js/script.js
routes/                 API route definitions
  ai.routes.js
controllers/            Request and response handling
  ai.controller.js
services/               Gemini API logic
  ai.service.js
config/                 Environment configuration
  env.js
server.js               Express application entry point
.env.example            Environment variable template
```

## Setup

1. Open a terminal in this project folder.
2. Install the dependencies:

```bash
npm install
```

3. Create a file named `.env` in the project root. You can copy the values from `.env.example`:

```env
GEMINI_API_KEY=your_real_api_key_here
PORT=3000
```

Replace `your_real_api_key_here` with your Gemini API key. Keep this file private. It is ignored by Git and must never be placed in frontend files.

## Run the project

For normal use:

```bash
npm start
```

For development with Node's built-in file watcher:

```bash
npm run dev
```

Open `http://localhost:3000` in a browser.

## Test the server

The health-check endpoint confirms that the server is running:

```text
GET http://localhost:3000/api/health
```

It should return:

```json
{
  "success": true,
  "message": "Server is running"
}
```

The AI endpoint accepts a POST request with a prompt:

```json
{
  "prompt": "Explain Node.js in simple words."
}
```

## Use the website

Type a question or instruction into the prompt box and select **Generate**. The button shows a loading state while the server asks Gemini for a response. Empty prompts and connection problems are shown as friendly messages.

The Gemini API key is used only by the Node.js server. Never share it, commit it, or place it in browser JavaScript.
