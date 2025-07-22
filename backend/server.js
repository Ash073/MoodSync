// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";


// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.use("/api/moods", moodRoutes);
console.log("🔗 Connecting to:", process.env.MONGO_URI);
// Log the MongoDB URI (for debug only — remove in production)

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

