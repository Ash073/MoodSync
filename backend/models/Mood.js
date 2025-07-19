// backend/models/Mood.js
import mongoose from "mongoose";

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
const Mood = mongoose.model("Mood", moodSchema);
export default Mood;
