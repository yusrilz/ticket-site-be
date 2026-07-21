const jwt = require("jsonwebtoken");
const User = require("../models/Users");


const protect = async (req, res, next) => {
    let token;

    // Check if the token is present in the cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user to the request object, excluding the password
        req.user = await User.findById(decoded.id).select("-password");
        
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
}

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admin resources only." });
    }
};

module.exports = { protect, requireAdmin };