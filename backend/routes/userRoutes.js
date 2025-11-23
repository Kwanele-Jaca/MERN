import express from "express";
import { upload } from "../config/cloudinary.js";
import User from "../models/pro.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// Upload profile picture
router.post(
  "/uploadProfilePic",
  authenticateToken,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const imageUrl = req.file.path;

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { profilePicture: imageUrl },
        { new: true }
      );

      res.json({ message: "Profile picture updated", user });
    } catch (err) {
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;
