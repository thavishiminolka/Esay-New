// console.log("userAuth.js: Loading module");
// const jwt = require('jsonwebtoken');

// const userAuth = async (req, res, next) => {
//     console.log("userAuth: Entering middleware");
//     const { token } = req.cookies;
//     console.log("userAuth: Token received:", token ? "Present" : "Missing");
//     if (!token) {
//         return res.status(401).json({ success: false, message: 'Not authorized, please login again' });
//     }
//     try {
//         if (!process.env.JWT_SECRET) {
//             throw new Error('JWT_SECRET is not defined in environment variables');
//         }
//         const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("userAuth: Token decoded:", tokenDecode);
//         if (!tokenDecode.id) {
//             return res.status(401).json({ success: false, message: 'Invalid token, please login again' });
//         }
//         req.userId = tokenDecode.id;
//         console.log("userAuth: Set req.userId:", req.userId);
//         next();
//     } catch (error) {
//         console.error('userAuth error:', error.message);
//         return res.status(401).json({ success: false, message: error.message });
//     }
// };

// module.exports = userAuth;




console.log("userAuth.js: Loading module");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Ensure this path is correct

const userAuth = async (req, res, next) => {
    console.log("userAuth: Entering middleware");
    const { token } = req.cookies;
    console.log("userAuth: Token received:", token ? "Present" : "Missing");
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, please login again' });
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("userAuth: Token decoded:", tokenDecode);
        if (!tokenDecode.id) {
            return res.status(401).json({ success: false, message: 'Invalid token, please login again' });
        }

        // Set userId
        req.userId = tokenDecode.id;
        console.log("userAuth: Set req.userId:", req.userId);

        // Fetch user from database to get name and email
        const user = await User.findById(tokenDecode.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Validate name and email
        if (!user.name || !user.email || !user.lName) {
            return res.status(400).json({ success: false, message: 'User profile incomplete: name or email missing' });
        }

        // Set req.user with name and email
        req.user = { name: user.name, email: user.email, lName: user.lName };
        console.log("userAuth: Set req.user with name and email:", req.user);

        next();
    } catch (error) {
        console.error('userAuth error:', error.message);
        return res.status(401).json({ success: false, message: error.message });
    }
};

module.exports = userAuth;