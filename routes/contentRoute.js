const express = require('express');
const contentController = require('../controllers/contentController');

const router = express.Router();

router.get('/people', contentController.getPeople);

module.exports = router;
