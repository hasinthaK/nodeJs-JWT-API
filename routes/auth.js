const router = require('express').Router();
const loginUser = require('../models/LoginUser');
const registerUser = require('../models/RegisterUser');
const { registerValidator } = require('../validation');

// Register
router.post('/register', async (req, res) => {
    console.log('Register API');

    //Validate req data
    //Extract error object from the validation object
    //null if valid
    const {error} = registerValidator(req.body);
    if(error) {
        console.log(error.details[0].message);
        return res.status(400).send(error.details[0].message);
    };


    // res.send(validated);

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
});

//Login
router.post('/login', (req, res) => {
    console.log('Login API');
    res.send('Login API');
});

module.exports = router;