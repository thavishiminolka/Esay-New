const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const transporter = require('../config/nodemailer');

// const register = async (req, res) => {
//     const { name, email, password, lName, phone } = req.body;
//     if (!name || !email || !password || !lName || !phone) {
//         return res.json({ success: false, message: 'Missing details' });
//     }
//     if (!process.env.JWT_SECRET) {
//         return res.status(500).json({ success: false, message: 'JWT_SECRET is not defined in the environment variables' });
//     }
//     try {
//         const existingUser = await userModel.findOne({ email });
//         if (existingUser) {
//             return res.json({ success: false, message: 'User already exists' });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new userModel({ name, email, password: hashedPassword, lName, phone });
//         await user.save();
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//         });
//         const mailOption = {
//             from: process.env.SENDER_EMAIL,
//             to: email,
//             subject: 'Welcome to Esay...',
//             text: `Welcome to Esay international exam training platform. Your account has been successfully created with email id: ${email}`,
//         };
//         await transporter.sendMail(mailOption);
//         return res.json({ success: true });
//     } catch (error) {
//         console.error('Register error:', error.message);
//         return res.json({ success: false, message: error.message });
//     }
// };

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password are required' });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ success: false, message: 'JWT_SECRET is not defined in the environment variables' });
    }
    try {
        const user = await userModel.findOne({ email });
        console.log("login: User query result:", user ? { id: user._id, email: user.email } : "No user found");
        if (!user) {
            return res.json({ success: false, message: 'Invalid email' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log("login: Generated token for userId:", user._id.toString());
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ success: true, userId: user._id.toString() });
    } catch (error) {
        console.error('Login error:', error.message);
        return res.json({ success: false, message: error.message });
    }
};



const register = async (req, res) => {
    const { name, email, password, lName, phone } = req.body;
    if (!name || !email || !password || !lName || !phone) {
        return res.json({ success: false, message: 'Missing details' });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ success: false, message: 'JWT_SECRET is not defined in the environment variables' });
    }
    try {
        // Validate phone number format - it should now be in E.164 format (e.g., +94701234567)
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phone)) {
            return res.json({ success: false, message: 'Invalid phone number format' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword, lName, phone });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Esay...',
            text: `Welcome to Esay international exam training platform. Your account has been successfully created with email id: ${email}`,
        };
        await transporter.sendMail(mailOption);
        return res.json({ success: true });
    } catch (error) {
        console.error('Register error:', error.message);
        return res.json({ success: false, message: error.message });
    }
};



const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error.message);
        return res.json({ success: false, message: error.message });
    }
};

const sendVerifyOtp = async (req, res) => {
    try {
        // Force log to ensure function is entered
        console.log("sendVerifyOtp: Function entered, userId:", req.userId || "undefined");
        const userId = req.userId;
        if (!userId) {
            console.log("sendVerifyOtp: No userId provided");
            return res.json({ success: false, message: 'No user ID provided' });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log("sendVerifyOtp: Invalid ObjectId:", userId);
            return res.json({ success: false, message: 'Invalid user ID' });
        }
        const user = await userModel.findById(new mongoose.Types.ObjectId(userId));
        console.log("sendVerifyOtp: User query result:", user ? { id: user._id.toString(), email: user.email } : "No user found");
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        if (user.isAccountVerified) {
            console.log("sendVerifyOtp: User already verified:", user.email);
            return res.json({ success: false, message: 'Account already verified' });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        console.log("sendVerifyOtp: Generated OTP:", otp);
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();
        console.log("sendVerifyOtp: User updated with OTP for:", user.email);
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify your account',
            text: `Your OTP for verification is ${otp}. Do not share this OTP with anyone.`,
        };
        await transporter.sendMail(mailOption);
        console.log("sendVerifyOtp: OTP email sent to:", user.email);
        return res.json({ success: true, message: 'Verification OTP sent to your email' });
    } catch (error) {
        console.error('sendVerifyOtp error:', error.message);
        return res.json({ success: false, message: error.message });
    }
};


const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    console.log("verifyEmail: Received request body:", { userId, otp }); // Added debug log
    if (!userId || !otp) {
        return res.json({ success: false, message: 'User ID and OTP are required' });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account already verified' });
        }
        if (user.verifyOtp ===''||user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error('verifyEmail error:', error.message);
        return res.json({ success: false, message: error.message });
    }
};

const isAuthenticated = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select('name email isAccountVerified');
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        return res.json({
            success: true,
            userId: req.userId,
            user: {
                name: user.name,
                email: user.email,
                isVerified: user.isAccountVerified,
            },
        });
    } catch (error) {
        console.error('isAuthenticated error:', error.message);
        return res.json({ success: false, message: error.message });
    }
};

const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is ${otp}. Do not share this OTP with anyone.`,
        };
        await transporter.sendMail(mailOption);
        return res.json({ success: true, message: 'Reset password OTP sent to your email' });
    } catch (error) {
        console.error('sendResetOtp error:', error.message);
        return res.json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP, and new password are required' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        if (user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('resetPassword error:', error.message);
        return res.json({ success: false, message: error.message });
    }
};


//checking if user is active and access hasn't expired
const checkAccess = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select('isActive activeUntil');
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        // Check if user is active and access hasn't expired
        const isAccessValid = user.isActive && user.activeUntil && user.activeUntil > new Date();
        if (!isAccessValid && user.isActive) {
            // Auto-deactivate if expired
            user.isActive = false;
            user.activeUntil = null;
            await user.save();
        }
        return res.json({
            success: true,
            canAccessExam: isAccessValid
        });
    } catch (error) {
        console.error('checkAccess error:', error.message);
        return res.json({ success: false, message: error.message });
    }
};


module.exports = { register ,login,logout,checkAccess,resetPassword ,sendResetOtp,verifyEmail,isAuthenticated,sendVerifyOtp};