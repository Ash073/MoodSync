// backend/controllers/moodController.js
import Mood from "../models/Mood.js";
import User from "../models/User.js";
import { getTracksByMood } from "../utils/spotify.js";

// Mood synonyms map
const moodSynonyms = {
  Happy: ["happy", "joyful", "excited", "cheerful", "delighted", "content", "glad"],
  Sad: ["sad", "depressed", "down", "blue", "unhappy", "sorrowful", "heartbroken"],
  Energetic: ["energetic", "pumped", "hyped", "active", "motivated"],
  Relaxed: ["relaxed", "calm", "chill", "peaceful", "serene"],
  Angry: ["angry", "furious", "mad", "irritated", "frustrated"],
  Romantic: ["romantic", "love", "affection", "passionate"],
  Lonely: ["lonely", "alone", "empty", "isolated"],
  Nostalgic: ["nostalgic", "memory", "remember", "sentimental"],
  Hopeful: ["hopeful", "optimistic", "positive", "uplifted"],
  Fearful: ["afraid", "scared", "anxious", "nervous", "worried"]
};

// Detect mood from free-form sentence
const detectMood = (text) => {
  const lower = text.toLowerCase();
  for (const mood in moodSynonyms) {
    if (moodSynonyms[mood].some(word => lower.includes(word))) {
      return mood;
    }
  }
  return "Relaxed"; // fallback
};

// Add a new mood and fetch Spotify recommendations
export const addMood = async (req, res) => {
  const { moodSentence, language } = req.body;

  try {
    if (!moodSentence) {
      return res.status(400).json({ message: "Mood sentence is required" });
    }

    const mood = detectMood(moodSentence);
    console.log("🔍 Detected Mood:", mood);
    console.log("🌍 Selected Language:", language);

    let recommendations = [];
    try {
      recommendations = await getTracksByMood(mood, language);
      console.log(`✅ Found ${recommendations.length} recommendations for ${language}`);
    } catch (error) {
      console.error("⚠ Spotify fetch failed:", error.message);
    }

    // Ensure recommendations are mapped correctly
    const mappedRecs = (recommendations || []).map(track => ({
      title: track.title || "Unknown Title",
      artist: track.artist || "Unknown Artist",
      albumImage: track.albumImage || "",
      spotifyUrl: track.url || "",
      preview: track.preview || null
    }));

    // Save mood to DB
    const newMood = await Mood.create({
      mood,
      language,
      recommendations: mappedRecs,
      user: req.user?._id || null,
    });

    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.moods.push(newMood._id);
        await user.save();
      }
    }

    console.log("✅ Mood saved successfully");
    res.status(201).json({ detectedMood: mood, recommendations: mappedRecs });
  } catch (error) {
    console.error("❌ Error adding mood:", error.message);
    res.status(500).json({ message: "Failed to add mood" });
  }
};

// Get all moods of the user
export const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(moods);
  } catch (error) {
    console.error("❌ Error fetching moods:", error.message);
    res.status(500).json({ message: "Failed to retrieve moods" });
  }
};
