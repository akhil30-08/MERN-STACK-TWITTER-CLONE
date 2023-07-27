const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { MONGODB_URL } = require('./config');
const app = express();
const { router } = require('./multer-configuration/profile-image');
const { tweetRouter } = require('./multer-configuration/tweet-image');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connecting to MONGODB
mongoose.connect(process.env.MONGODBURL);

//Checking if it is connected
mongoose.connection.on('connected', () => console.log('DB Connected'));
mongoose.connection.on('error', (error) => console.log(error));

//inserting schemas
require('./models/user_model');
require('./models/tweet_model');

//inserting routes
app.use('/API/auth', require('./routes/auth'));
app.use('/API', require('./routes/user'));
app.use('/api/tweet', require('./routes/tweet'));
app.use(router); //profile picture download
app.use(tweetRouter); //tweetpicture download

//testing route
app.get('/deploy', (req, res) => {
  return res.status(200).send('Welcome to deployment');
});

app.listen(8000, () => console.log('Server Connected at Port 8000'));
