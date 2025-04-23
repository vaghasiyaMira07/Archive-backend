const jwt = require("jsonwebtoken");

// Required Config
const JWT_SECRET  = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
    const token = req.header("x-auth-token");

  // Check for token
    if (!token)
        return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        // Add user from payload
        req.user = { userId: decoded.userId, userName: decoded.userName, userRole: decoded.userRole };
        next();
    } catch (e) {
        res.status(400).json({ msg: "Token is not valid" });
    }
};