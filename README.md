# Promptly AI Assistant

A simple AI website made for Module 10 Assignment using HTML, CSS, JavaScript, Node.js, and Express.js.

## Features

- Simple prompt input box
- Generate button with loading state
- AI response shown on the website
- Error message for an empty prompt
- Responsive CSS design
- API key kept on the server in `.env`

## Run the project

1. Install Node.js 18 or newer.
2. Install the packages:

```bash
npm install
```

3. Create a file named `.env` by copying `.env.example`.
4. Put your API key in `.env` and check the API URL and model for your AI provider.
5. Start the server:

```bash
npm start
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Important security note

Never add `.env` to GitHub. It is already included in `.gitignore`. The frontend never receives the API key; only the Express server uses it.

## GitHub submission

After creating an empty repository on GitHub, run these commands from this folder:

```bash
git init
git add .
git commit -m "Build simple AI website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Do not run `git add .env`.
