// controllers/moodController.js
import Mood from "../models/Mood.js";
import User from "../models/User.js";
import { getTracksByMood } from "../utils/spotify.js";

// Add a new mood and get Spotify recommendations
export const addMood = async (req, res) => {
  const { mood, language } = req.body;

  try {
    // Fetch recommended songs from Spotify utility
    const recommendations = await getTracksByMood(mood, language);

    // Create mood document
    const newMood = await Mood.create({
      mood,
      language,
      recommendations,
      user: req.user._id,
    });

    // Update the user’s mood history
    const user = await User.findById(req.user._id);
    user.moods.push(newMood._id);
    await user.save();

    res.status(201).json(newMood);
  } catch (error) {
    console.error("Error adding mood:", error.message);
    res.status(500).json({ message: "Failed to add mood" });
  }
};

// Fetch mood history of a user
export const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(moods);
  } catch (error) {
    console.error("Error getting moods:", error.message);
    res.status(500).json({ message: "Failed to retrieve moods" });
  }
};
