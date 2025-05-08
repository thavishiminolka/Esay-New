const express = require("express");
const { 
    login, 
    logout, 
    register, 
    verifyEmail, 
    sendVerifyOtp, 
    isAuthenticated, 
    sendResetOtp, 
    resetPassword, 
    checkAccess 
  } = require('../controllers/authController');
  
  const userAuth = require('../middleware/userAuth');
  
const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/Verify-account',userAuth,verifyEmail);
authRouter.get('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);
authRouter.get('/check-access', userAuth, checkAccess);





module.exports = authRouter;
