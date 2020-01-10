const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwtverifier = require('./middlewares/jwtverifier');
const cors = require('cors');

//App middlewares
app.use(express.json());
app.use(cors());
dotenv.config();

// DB connect
try{
    mongoose.connect('mongodb+srv://hasintha2:has1nthamongolab2@khkcluster0-gsoaq.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log('DB Connection OK!');
    });
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
const port = process.env.PORT;
app.listen(port || 3000, () => console.log(`Listening on ${port} || 3000`));