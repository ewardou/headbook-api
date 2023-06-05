const express = require('express');

const router = express.Router();

router.get('/protected', (req, res) => {
    res.json('Accessed protected content');
});

module.exports = router;
