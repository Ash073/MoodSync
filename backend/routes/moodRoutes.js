// backend/routes/moodRoutes.js
import express from "express";
import { addMood, getMoods } from "../controllers/moodController.js";
import protect  from "../middleware/authMiddleware.js";
import { getTracksByMood } from "../utils/spotify.js";

const router = express.Router();

router.post("/", protect, addMood);
router.get("/", protect, getMoods);

// ✅ New: Get Spotify recommendations based on mood
router.get("/recommendations", protect, async (req, res) => {
  try {
    const { mood, language } = req.query;

    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    const tracks = await getTracksByMood(mood, language || "English");
    res.json(tracks);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
});

export default router;
