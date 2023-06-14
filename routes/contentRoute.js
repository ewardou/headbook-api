const express = require('express');
const contentController = require('../controllers/contentController');

const router = express.Router();

router.get('/people', contentController.getPeople);
router.post('/request', contentController.sendRequest);
router.post('/accept-request', contentController.acceptFriendRequest);
router.post('/decline-request', contentController.declineFriendRequest);

module.exports = router;
