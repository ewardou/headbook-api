const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/sign-up', authController.createNewUser);
router.post('/login', authController.login);
router.get('/upload-auth', authController.getUploadAuth);

module.exports = router;
