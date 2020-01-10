const router = require('express').Router();
const loginUser = require('../models/LoginUser');
const registerUser = require('../models/RegisterUser');

// Register
router.post('/register', (req, res) => {
    console.log('Register API');
    res.send('Register API');
});

//Login
router.post('/login', (req, res) => {
    console.log('Login API');
    res.send('Login API');
});

module.exports = router;