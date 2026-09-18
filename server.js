const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/generate', async (req, res) => {
  const prompt = typeof req.body.prompt === 'string' ? req.body.prompt.trim() : '';

  if (!prompt) {
    return res.status(400).json({ error: 'Please write a prompt first.' });
  }

  if (!process.env.AI_API_KEY) {
    return res.status(500).json({
      error: 'AI API key is missing. Please add it to your .env file.'
    });
  }

  try {
    const response = await fetch(process.env.AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Give clear and useful answers.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const apiMessage = data.error?.message || 'The AI service returned an error.';
      return res.status(response.status).json({ error: apiMessage });
    }

    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(502).json({ error: 'No answer was received from the AI service.' });
    }

    res.json({ answer });
  } catch (error) {
    console.error('AI request failed:', error.message);
    res.status(500).json({ error: 'Could not connect to the AI service.' });
  }
});

app.listen(port, () => {
  console.log(`AI website is running at http://localhost:${port}`);
});
