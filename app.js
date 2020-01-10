const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const cors = require('cors');


dotenv.config();

// DB connect
try{
    mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log('Connected to DB');
    });
} catch (err) {
    console.error(err);
}

//import Routes
const authRoutes = require('./routes/auth');


//Route middlewares
app.use('/user', authRoutes);


//Listen on port
const port = process.env.PORT;
app.listen(port || 3000, () => console.log(`Listening on ${port} || 3000`));