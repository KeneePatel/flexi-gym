const User = require('../models/User');
const Constants = require('../utils/Constants');
const bcrypt = require('bcryptjs');
const {response} = require("express");

//Update the user record by userId
exports.updateUserById = async (request, response) => {
    const { fullName, password, phone, address, preference } = request.body;

    try {
        let userId = request.params.id;

        let userRecord = await User.findById(userId);
        if (!userRecord) {
            return response.status(Constants.NOTFOUND).json({ message: 'User not found' });
        }

        userRecord.fullName = fullName || userRecord.fullName;
        userRecord.phone = phone || userRecord.phone;
        userRecord.address = address || userRecord.address;
        userRecord.preference = preference || userRecord.preference;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            userRecord.password = await bcrypt.hash(password, salt);
        }

        await userRecord.save();

        response.json({ message: 'User with id :{} updated successfully',userId});
    } catch (error) {
        response.status(Constants.INTERNALERRORSTATUS).send('Server error');
    }
};

//Get the user record by userId
exports.getUserById = async (request, response) => {
    try {
        const userRecord = await User.findById(request.params.id).select(Constants.REMOVEUSERCOLUMNPASSWORD);
        if (!userRecord) {
            return response.status(Constants.NOTFOUND).json({ message: 'User not found' });
        }
        response.json(userRecord);
    } catch (error) {
        response.status(Constants.INTERNALERRORSTATUS).send('Server error');
    }
};

//Delete the user record by userId
exports.deleteUserById = async (request, response) => {
    try {
        let userId = request.params.id;

        const userRecord = await User.findById(userId);
        if (!userRecord) {
            return response.status(Constants.NOTFOUND).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(userId);

        response.json({ message: 'User deleted successfully' });
    } catch (error) {
        response.status(Constants.INTERNALERRORSTATUS).send('Server error');
    }
};