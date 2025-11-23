import express from 'express';
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import { connectDB } from "./config/db.js";
import User from "./models/pro.js";
import Project from "./models/project.js"
import projectRoutes from "./routes/projectRoutes.js"
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";


 
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
console.log(" Loaded JWT_SECRET:", JWT_SECRET);

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

app.use(cors({
  origin: "*",
  credentials: true,
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);


// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    
    req.user = user; // Attach user data to request
    next(); // Continue to the next middleware/route
  });
};

// Authorization Middleware - Check if user has required role
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

app.post("/register", async (req, res) => {
  try {
    console.log("Incoming body:", req.body); // debug log

    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    // Return success response with token and user info
    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture

      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
});


app.get("/Dashboard", authenticateToken, requireRole("admin"), (req, res) => {
  res.json({ 
    success: true,
    message: "Admin dashboard access granted!",
    user: req.user
  });
});

app.get("/UserDashboard", authenticateToken, requireRole("user"), (req, res) => {
  res.json({
    success: true,
    message: "User dashboard access granted!", 
    user: req.user
  });
});

app.use("/projects",projectRoutes);

//import express from "express";

/*app.use(express.static(path.join(__dirname, "../frontend/dist")));



app.get(['/', '/login', '/register', '/dashboard', '/userdashboard'], (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});*/

app.listen(5000, () => {
  connectDB();
  console.log("Server running at http://localhost:5000");
});
