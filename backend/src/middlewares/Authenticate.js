const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Constants = require('../utils/Constants');

exports.authenticate = async (request, response, next) => {
    let JWT;

    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        JWT = request.headers.authorization.split(' ')[1];
    }

    if (!JWT) {
        return response.status(Constants.STATUSNOTAUTHORIZED).json({ success: false, message: Constants.NOTAUTHORIZEDMSG });
    }

    try {
        const decodedUser = jwt.verify(JWT, process.env.JWT_SECRET);
        request.user = await User.findById(decodedUser.id).select(Constants.REMOVEUSERCOLUMNPASSWORD);
        next();
    } catch (error) {
        response.status(Constants.STATUSNOTAUTHORIZED).json({ success: false, message: Constants.NOTAUTHORIZEDMSG });
    }
};