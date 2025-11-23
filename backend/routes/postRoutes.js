import express from "express";
import { upload } from "../config/cloudinary.js"; 
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(" Incoming Authorization Header:", authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error(" JWT Verify Error:", err.message);
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    console.log("Token verified successfully:", user);
    req.user = user;
    next();
  });
};

router.post(
  "/create",
  authenticateToken,
  upload.single("image"),       
  async (req, res) => {
    console.log("---- New Post Request Arrived ----");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    try {
      const imageUrl = req.file ? req.file.path : null; // Cloudinary URL

      const post = await Post.create({
        userId: req.user.userId,
        text: req.body.text,
        image: imageUrl,
      });

      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create post" });
    }
  }
);


router.get("/", authenticateToken, async (req, res) => {
  const posts = await Post.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.json(posts);
});

router.post("/:postId/like", authenticateToken, async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) return res.status(404).json({ error: "Post not found" });

  if (post.likes.includes(req.user.userId)) {
    // unlike
    post.likes.pull(req.user.userId);
  } else {
    // like
    post.likes.push(req.user.userId);
  }

  await post.save();
  res.json({ likes: post.likes.length });
});


router.post("/:postId/comment", authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.create({
      postId: req.params.postId,
      userId: req.user.userId,
      comment: req.body.comment,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to post comment" });
  }
});


router.get("/:postId/comments", authenticateToken, async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId })
    .populate("userId", "name")
    .sort({ createdAt: -1 });

  res.json(comments);
});
export default router;