import User from "../models/User.js";
import jwt from "jsonwebtoken";
// middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // <-- correct
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({ success: false, message: "JWT must be provided" });
    }

    const token = authHeader.split(" ")[1]; // get the actual token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
