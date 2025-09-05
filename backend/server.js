// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import spotifyRoutes from "./routes/spotifyRoutes.js";
import authRoutes from "./routes/authRoutes.js";


// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.use("/api/moods", moodRoutes);

app.use("/api/spotify", spotifyRoutes);
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(5000,'0.0.0.0', () => console.log("🚀 Server started on port 5000"));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error(err.message || err);
    process.exit(1); // Exit with failure
  });
  app.get("/", (req, res) => {
  res.send("Mood Sync Backend is running 🚀");
});

