const form = document.getElementById('prompt-form');
const promptInput = document.getElementById('prompt');
const generateButton = document.getElementById('generate-button');
const buttonText = document.getElementById('button-text');
const result = document.getElementById('result');
const errorMessage = document.getElementById('error-message');
const characterCount = document.getElementById('character-count');
const responseState = document.getElementById('response-state');
const requestCount = document.getElementById('request-count');

let answersGenerated = 0;

promptInput.addEventListener('input', () => {
  characterCount.textContent = `${promptInput.value.length} / 2000`;
  errorMessage.textContent = '';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = promptInput.value.trim();

  if (!prompt) {
    errorMessage.textContent = 'Please write a prompt before generating an answer.';
    promptInput.focus();
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const responseText = await response.text();
    let data = {};

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      throw new Error('The server returned an invalid response. Please try again.');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong. Please try again.');
    }

    result.classList.remove('empty-result');
    result.textContent = data.answer;
    responseState.textContent = 'Answer ready';
    answersGenerated += 1;
    requestCount.textContent = `${answersGenerated} ${answersGenerated === 1 ? 'answer' : 'answers'} generated`;
  } catch (error) {
    errorMessage.textContent = error.message;
    responseState.textContent = 'Could not generate answer';
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  generateButton.disabled = isLoading;
  buttonText.textContent = isLoading ? 'Thinking...' : 'Generate answer';
  responseState.textContent = isLoading ? 'Generating response...' : responseState.textContent;
  if (isLoading) {
    result.classList.add('empty-result');
    result.textContent = 'The assistant is preparing your answer...';
  }
}
