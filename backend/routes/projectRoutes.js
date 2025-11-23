import express from "express";
import { upload } from "../config/cloudinary.js";
import Project from "../models/project.js";
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
      // Convert a location string into lat/lng using OpenStreetMap API
const geocodeLocation = async (location) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );

    const data = await res.json();
    if (!data.length) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (err) {
    console.error("Geocoding failed:", err);
    return null;
  }
};

router.post("/upload", authenticateToken, upload.array("files", 5), async (req, res) => {
  try {
    const { title, company, location, budget, progress, expectedCompletion } = req.body;

    // Separate uploaded files into images + pdfs
    const images = req.files
      .filter(file => file.mimetype.startsWith("image/"))
      .map(file => file.path);

    const pdfs = req.files
      .filter(file => file.mimetype === "application/pdf")
      .map(file => file.path);

    //  Convert location into coordinates
    const coordinates = await geocodeLocation(location);

    const project = new Project({
      title,
      company,
      location,
      budget,
      progress,
      expectedCompletion,
      images,
      pdfs,
      createdBy: req.user.userId,
      coordinates   
    });

    await project.save();
    res.status(201).json({ message: "Project uploaded successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload project" });
  }
});


router.get("/myProjects", authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error("Error in /myProjects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});
export default router;
