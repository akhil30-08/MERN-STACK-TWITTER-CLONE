const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGODB_URL } = require('./config');
const app = express();
const path = require('path');
const Port = process.env.PORT || 8000;

const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/dist')));

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

//testing route
app.get('/deploy', (req, res) => {
  return res.status(200).send(`<h1>Deployed successfully</h1>`);
});

app.listen(Port, () => console.log(`Server Connected at Port ${Port}`));
