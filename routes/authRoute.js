const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/sign-up', authController.createNewUser);
router.post('/login', authController.login);

module.exports = router;
