const express = require('express');
const server = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const Constants = require('./utils/Constants');
const mongodb = require('./config/DatabaseConnection');
const authRoute = require('./routes/AuthRoute');


const SERVERPORT = process.env.PORT || 5000;
try{
    mongodb();
}
catch(e){
    console.error(e.message);
}


// Middleware parser
server.use(bodyParser.json());

server.use('/api/auth', authRoute);

server.get('/', (req, res) => {
    res.send(Constants.BASEROUTEMSG);
});
// Start the server
server.listen(SERVERPORT, () => {
    console.log('Server is up and running successfully.');
});


