const express = require('express');
const contentController = require('../controllers/contentController');

const router = express.Router();

router.get('/people', contentController.getPeople);
router.post('/request', contentController.sendRequest);

module.exports = router;
