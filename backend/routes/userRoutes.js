import express from 'express'
import userAuth from '../middleware/userAuth.js'
import { getUserData } from '../controllers/userController.js'
import { getUsers, toggleActivation } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData);
userRouter.get('/', userAuth, getUsers);
userRouter.patch('/:id/activate', userAuth, toggleActivation);

export default userRouter;