const express = require('express');
const {updateUserById,getUserById,deleteUserById} = require('../controllers/userController');
const router = express.Router();
const {authenticate} = require('../middlewares/Authenticate');
const {userAuthorization} = require('../middlewares/Authorization');

//Routes for user record
router.get('/:id',authenticate, getUserById);
router.put('/:id',authenticate,userAuthorization, updateUserById);
router.delete('/:id',authenticate,userAuthorization, deleteUserById);


module.exports = router;