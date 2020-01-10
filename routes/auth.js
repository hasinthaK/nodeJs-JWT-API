const router = require('express').Router();

// Register
router.post('/register', (req, res) => {
    console.log('Register API: ');
    res.send('Register API');
});

module.exports = router;