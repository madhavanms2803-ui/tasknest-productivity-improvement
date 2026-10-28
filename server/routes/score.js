const express = require('express');
const { getScore } = require('../controllers/scoreController');

const router = express.Router();
router.get('/', getScore);

module.exports = router;
