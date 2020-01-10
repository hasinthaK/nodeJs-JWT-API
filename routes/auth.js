const router = require('express').Router();
const loginUser = require('../models/LoginUser');
const registerUser = require('../models/RegisterUser');

// Register
router.post('/register', async (req, res) => {
    console.log('Register API');

    const newUser = new registerUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try{
        const savedUser = await newUser.save();
        console.log(`New user created: ${newUser.name}`);
        res.send(savedUser);
    }catch (err) {
        console.error('DB save error');
        res.status(400).send(err);
    }

    // res.send('Register API');
});

//Login
router.post('/login', (req, res) => {
    console.log('Login API');
    res.send('Login API');
});

module.exports = router;