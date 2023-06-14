const express = require('express');
const contentController = require('../controllers/contentController');

const router = express.Router();

router.get('/people', contentController.getPeople);
router.post('/request', contentController.sendRequest);
router.post('/accept-request', contentController.acceptFriendRequest);

module.exports = router;
