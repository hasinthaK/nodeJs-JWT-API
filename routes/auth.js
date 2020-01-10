const router = require('express').Router();
const loginUser = require('../models/LoginUser');
const bcrypt = require('bcryptjs');
const registerUser = require('../models/RegisterUser');
const { registerValidator, loginValidator } = require('../validation');

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

    //Check if the email already exists
    const dbUser = await registerUser.findOne({email: req.body.email});
    if(dbUser) {
        console.error('Email is already in use!');
        return res.status(400).send('Email is already in use!');
    }

    //Password hashing
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(req.body.password, salt);

    //If valid data & No existing user with email, create New User in DB
    const newUser = new registerUser({
        name: req.body.name,
        email: req.body.email,
        password: hashed
    });

    try{
        const savedUser = await newUser.save();
        console.log(`New user created: ${newUser.email}`);
        res.send({user_id: savedUser._id});
    }catch (err) {
        console.error('DB save error');
        res.status(400).send(err);
    }
});

//Login
router.post('/login', (req, res) => {
    console.log('Login API');

    const {error} = loginValidator(req.body);
    if(error) {
        console.log(error.details[0].message);
        return res.status(400).send(error.details[0].message);
    };


});

module.exports = router;