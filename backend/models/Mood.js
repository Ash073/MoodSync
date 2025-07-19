// backend/models/Mood.js
const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
  mood: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "English",
  },
  recommendations: [
    {
      title: String,
      artist: String,
      url: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Mood", moodSchema);
