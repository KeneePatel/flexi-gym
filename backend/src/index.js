const express = require('express');
const server = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const Constants = require('./utils/Constants');
const mongodb = require('./config/DatabaseConnection');
const authRoute = require('./routes/AuthRoute');
const userRoute = require('./routes/UserRoute');

const SERVERPORT = process.env.PORT || 5000;
try{
    mongodb();
}
catch(e){
    console.error(e.message);
}

server.use(bodyParser.json());

server.use('/api/auth', authRoute);
server.use('/api/user', userRoute);

server.get('/', (req, res) => {
    res.send(Constants.BASEROUTEMSG);
});

server.listen(SERVERPORT, () => {
    console.log('Server is up and running successfully.');
});


