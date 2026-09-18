const path = require('path');
const express = require('express');
const { port } = require('./config/env');
const aiRoutes = require('./routes/ai.routes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running'
  });
});

app.use('/api', aiRoutes);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'Request body must be valid JSON.'
    });
  }

  return next(error);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
