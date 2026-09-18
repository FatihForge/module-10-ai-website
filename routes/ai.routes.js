const express = require('express');
const { generateResponse } = require('../controllers/ai.controller');

const router = express.Router();

router.post('/generate', generateResponse);

module.exports = router;
