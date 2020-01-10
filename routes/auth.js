const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { registerValidator, loginValidator } = require('../validation');

// Register
router.post('/register', async (req, res) => {
    // console.log('Register API');

    //Validate req data
    //Extract error object from the validation object
    //null if valid
    const {error} = registerValidator(req.body);
    if(error) {
        console.log(error.details[0].message);
        return res.status(400).send({message: error.details[0].message});
    };

    //Check if the email already exists
    const dbUser = await User.findOne({email: req.body.email});
    if(dbUser) {
        console.error('Email is already in use!');
        return res.status(400).send({message: 'Email is already in use!'});
    }

    //Password hashing
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(req.body.password, salt);

    //If valid data & No existing user with email, create New User in DB
    const newUser = new User({
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
///////////////////////Register END//////////////////////////////////////////////
//Login
router.post('/login', async (req, res) => {
    // console.log('Login API');

    // Validate data before login
    const {error} = loginValidator(req.body);
    if(error) {
        console.log(error.details[0].message);
        return res.status(400).send({message: error.details[0].message});
    };

    // Check if user is in the DB
    const dbUser = await User.findOne({email: req.body.email});
    if(!dbUser) {
        console.error('Email not found!');
        return res.status(400).send({message: 'Email not found!'});
    }

    // Check pass
    const validPass = await bcrypt.compare(req.body.password, dbUser.password);
    if(!validPass) {
        console.error('Password is incorrect!');
       return res.status(400).send({message: 'Password is incorrect!'});
    }

    //If password is valid Login!
    res.send({message: 'Logged in!'});

});
///////////////////////////Login END///////////////////////////////////////////////
module.exports = router;