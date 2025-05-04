const express = require('express');
const userAuth = require('../middleware/userAuth');
const { getUsers, toggleActivation, getUserData } = require('../controllers/userController');
const userRouter = express.Router();

userRouter.get('/data', userAuth,getUserData);
userRouter.get('/', userAuth, getUsers);
userRouter.patch('/:id/activate', userAuth, toggleActivation);

module.exports = userRouter;
