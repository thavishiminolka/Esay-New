console.log("userAuth.js: Loading module");
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    console.log("userAuth: Entering middleware");
    const { token } = req.cookies;
    console.log("userAuth: Token received:", token ? "Present" : "Missing");
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, please login agains' });
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
        req.userId = tokenDecode.id;
        console.log("userAuth: Set req.userId:", req.userId);
        next();
    } catch (error) {
        console.error('userAuth error:', error.message);
        return res.status(401).json({ success: false, message: error.message });
    }
};

module.exports = userAuth;