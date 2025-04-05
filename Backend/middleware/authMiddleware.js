



import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing in environment variables.");
        return res.status(500).json({ message: "Internal Server Error" });
      }

      const secretKey = process.env.JWT_SECRET.trim();

      const decoded = jwt.verify(token, secretKey);

      req.user = await User.findById(decoded.user._id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();

    } catch (error) {
      console.error("Token verification failed", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// MIddleware to check if the uer is an admin


export default protect;


