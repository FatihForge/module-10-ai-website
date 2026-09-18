const { generateText } = require('../services/ai.service');

async function generateResponse(req, res) {
  const prompt = req.body.prompt;

  if (typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Please enter a prompt.'
    });
  }

  try {
    const result = await generateText(prompt.trim());

    return res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Generate response error:', error.message);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong while generating the response. Please try again.'
    });
  }
}

module.exports = { generateResponse };
