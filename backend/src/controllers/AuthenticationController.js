const User = require('../models/User');
const CustomError = require('../utils/ErrorMessage');
const authService = require('../services/authService');
const crypto = require("crypto");
const Constants = require('../utils/Constants');

//Async method which handles user registration
exports.userRegistration = async (req, res, next) => {
    const { email, fullName, password, type } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(Constants.STATUSNOTFOUND).send({ error: Constants.EMAILEXISTS });
        }
        else{
            const hashedPassword = await authService.getHashedPassword(password);
            const user = await User.create({ email, fullName, password: hashedPassword, type });
            const JWT = authService.generateJWTToken(user);
            res.status(Constants.STATUSCREATED).json({ success: true, JWT });
        }
    } catch (error) {
        next(new CustomError(Constants.REGISTRATIONFAILED, error.message, 500));
    }
};

//Async method which handles user login using JWT
exports.userLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(Constants.STATUSNOTFOUND).json({ success: false, error: Constants.EMAILNOTEXISTS });
        }
        else{
            const match = await authService.matchPassword(password,user.password);
            if(!match){
                return res.status(Constants.STATUSNOTAUTHORIZED).json({ success: false, error: Constants.INVALIDPASSWORD });
            }
        }
        res.status(Constants.STATUSOK).json({ success: true, token: authService.generateJWTToken(user._id) });
    } catch (error) {
        console.log(error.message);
        next(new CustomError(Constants.LOGINFAILED, error.message, 500));
    }
};

//Reset Password method that is used to set new password by using the reset token send on user's email address.
exports.resetPassword = async (req, res) => {
    const resetPasswordToken = crypto.createHash(Constants.HASHALGO).update(req.params.passwordResetToken).digest(Constants.HASHENCODING);
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(Constants.STATUSNOTAUTHORIZED).json({ success: false, error: Constants.INVALIDJWTTOKEN });
        }

        user.password = await authService.getHashedPassword(req.body.password);
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save();

        res.status(Constants.STATUSOK).json({ success: true, token: authService.generateJWTToken(user._id) });
    } catch (error) {
        res.status(Constants.INTERNALERRORSTATUS).json({ success: false, error: error.message });
    }
};

//Forgot Password method mainly generates reset token and sent it through the email to user's email address.
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(Constants.STATUSNOTFOUND).json({ success: false, error: Constants.EMAILNOTEXISTS });
        }

        const resetToken = crypto.randomBytes(Constants.CRYPTOBYES).toString(Constants.HASHENCODING);
        user.resetPasswordToken = crypto.createHash(Constants.HASHALGO).update(resetToken).digest(Constants.HASHENCODING);
        user.resetPasswordExpire = Date.now() + Constants.MILLISECONDS * Constants.SECONDS * Constants.MINUTES; // token valid for only 20 minutes

        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

        const message = Constants.EMAILBODY + `${resetUrl}`;
        await authService.sendEmail({ email: user.email, subject: Constants.EMAILSUBJECT, message });

        res.status(Constants.STATUSOK).json({ success: true, message: Constants.RESETEMAILSENT });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(Constants.INTERNALERRORSTATUS).json({ success: false, error: Constants.RESETEMAILERROR });
    }
};

