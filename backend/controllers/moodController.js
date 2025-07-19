// backend/controllers/moodController.js
const Mood = require("../models/Mood");
const User = require("../models/User");
const { getTracksByMood } = require("../utils/spotify");

exports.saveMood = async (req, res) => {
  const { mood, language, recommendations } = req.body;

  try {
    const recommendations = await getTracksByMood(mood, language);
    const newMood = await Mood.create({
      mood,
      language,
      recommendations,
      user: req.user._id,
    });

    req.user.moods.push(newMood._id);
    await req.user.save();

    res.status(201).json(newMood);
  } catch (err) {
    console.error("Error saving mood:", err.message);
    res.status(500).json({ message: "Failed to save mood" });
  }
};

exports.getMoodHistory = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch mood history" });
  }
};
