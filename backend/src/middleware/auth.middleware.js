import { users } from "../models/User.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.method === "OPTIONS") {
      return next();
    }

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await users.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized access! User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
