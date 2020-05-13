const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwtverifier = require('./middlewares/jwtverifier');
const cors = require('cors');

//App middlewares
app.use(express.json());
app.use(cors());
dotenv.config({ path: `${__dirname}/.env` });

// DB connect 
try {
    mongoose.connect('mongodb://127.0.0.1:27017/local', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log(`DB Connection OK! - local`);
    });
    // mongoose.connect(process.env.DB_CONN || 'mongodb://127.0.0.1:27017/local', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    //     console.log(`DB Connection OK! - ${process.env.DB_CONN || 'local'}`);
    // });
} catch (err) {
    console.error(err);
}

//import Routes
const authRoutes = require('./routes/auth');
const privateRoutes = require('./routes/privateRoutes');

//Route middlewares
app.use('/user', authRoutes);
app.use('/get', jwtverifier, privateRoutes);


//Test Private routes
// app.get('/', jwtverifier, (req, res) => {
//     res.send('Private route');
// });


//Listen on port
app.listen(process.env.PORT || 3000, () => console.log(`Listening on ${process.env.PORT || '3000'}`));