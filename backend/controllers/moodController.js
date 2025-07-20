// controllers/moodController.js
// backend/controllers/moodController.js
import Mood from "../models/Mood.js";
import User from "../models/User.js";
import { getTracksByMood } from "../utils/spotify.js";

// Add a new mood and get Spotify recommendations
export const addMood = async (req, res) => {
  const { mood, language } = req.body;
  console.log("➡️ Mood Payload:", mood, language);
  console.log("🔐 User from req:", req.user);

  try {
    const recommendations = await getTracksByMood(mood, language);
    console.log("🎵 Spotify Recommendations:", recommendations);

    const newMood = await Mood.create({
      mood,
      language,
      recommendations,
      user: req.user._id,
    });

    const user = await User.findById(req.user._id);
    user.moods.push(newMood._id);
    await user.save();

    console.log("✅ Mood saved successfully");
    res.status(201).json({ recommendations });
  } catch (error) {
    console.error("❌ Error adding mood:", error);
    res.status(500).json({ message: "Failed to add mood" });
  }
};

// Get all moods of the user
export const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(moods);
  } catch (error) {
    console.error("❌ Error fetching moods:", error);
    res.status(500).json({ message: "Failed to retrieve moods" });
  }
};
