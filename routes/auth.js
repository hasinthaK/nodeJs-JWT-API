const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidator, loginValidator } = require('../validation');

// get configured redis client
const redisClient = require('../redis');

// Register
router.post('/register', async (req, res) => {
    // console.log('Register API');

    //Validate req data
    //Extract error object from the validation object
    //null if valid
    const { error } = registerValidator(req.body);
    if (error) {
        console.log(error.details[0].message);
        return res.status(400).send({ message: error.details[0].message });
    };

    //Check if the email already exists
    const dbUser = await User.findOne({ email: req.body.email });
    if (dbUser) {
        console.error('Email is already in use!');
        return res.status(400).send({ message: 'Email is already in use!' });
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

    try {
        const savedUser = await newUser.save();
        console.log(`New user created: ${newUser.email}`);
        res.send({ user_id: savedUser._id });
    } catch (err) {
        console.error('DB save error');
        res.status(400).send(err);
    }
});
///////////////////////Register END//////////////////////////////////////////////
//Login
router.post('/login', async (req, res) => {
    // console.log('Login API');

    // Validate data before login
    const { error } = loginValidator(req.body);
    if (error) {
        console.log(error.details[0].message);
        return res.status(400).send({ message: error.details[0].message });
    };

    // Check if user is in the DB
    const dbUser = await User.findOne({ email: req.body.email });
    if (!dbUser) {
        console.error('Email not found!');
        return res.status(400).send({ message: 'Email not found!' });
    }

    // Check pass
    const validPass = await bcrypt.compare(req.body.password, dbUser.password);
    if (!validPass) {
        console.error('Password is incorrect!');
        return res.status(400).send({ message: 'Password is incorrect!' });
    }

    //If password is valid Login!
    //Generate JWT
    const jwtPayload = {
        _id: dbUser._id,
        email: dbUser.email
    }
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP || 900, issuer: 'KHK' });
    const refreshtoken = jwt.sign(jwtPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXP || 86400, issuer: 'KHK' });

    // set refreshToken in redis store
    redisClient.set(refreshtoken, JSON.stringify(jwtPayload));
    // set expiration if env var available
    if (process.env.REDIS_EXP) redisClient.expire(refreshtoken, process.env.REDIS_EXP);
    res.status(200).header('auth-token', token).send({ token, refreshtoken });
    // res.send({message: 'Logged in!'});

});
///////////////////////////Login END///////////////////////////////////////////////
// refresh Token
router.post('/token', (req, res) => {
    // if no token is presented
    if (!req.body.refreshtoken) {
        res.status(404).send({ message: 'No refresh token is presented!' });
    }

    // get refreshToken from redis if available
    redisClient.get(req.body.refreshtoken, (err, reply) => {
        if (err) return res.status(400).send({ message: `Internal error, ${err}` });
        if (reply) {
            // when redis has the refresh token - create new JWT & send to the user
            console.log(`value got from Redis! ${reply}`);
            const token = jwt.sign(JSON.parse(reply), process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP || 900, issuer: 'KHK' });
            res.status(200).header('auth-token', token).send({ token });
        } else {
            // when redis has no token, it is an internal error
            return res.status(400).send({ message: `Redis could not find the refresh token provided!, Please Login as usual.` });
        }
    });
});
module.exports = router;