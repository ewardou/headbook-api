const express = require('express');
const contentController = require('../controllers/contentController');

const router = express.Router();

router.get('/people', contentController.getPeople);
router.post('/request', contentController.sendRequest);
router.post('/accept-request', contentController.acceptFriendRequest);
router.post('/decline-request', contentController.declineFriendRequest);
router.get('/my-profile', contentController.getMyInformation);

router.get('/posts', contentController.getPosts);
router.post('/new-post', contentController.createNewPost);
router.put('/dislike-post', contentController.dislikePost);
router.put('/like-post', contentController.likePost);

module.exports = router;
