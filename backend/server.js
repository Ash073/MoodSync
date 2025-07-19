// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const moodRoutes = require("./routes/moodRoutes");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/moods", moodRoutes);

// Log the MongoDB URI (for debug only — remove in production)
console.log("🔗 Connecting to:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(5000, () => console.log("🚀 Server started on port 5000"));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error(err.message || err);
    process.exit(1); // Exit with failure
  });
