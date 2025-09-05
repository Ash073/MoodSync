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
      albumImage: String,
      spotifyUrl: String,
      preview: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
}, { timestamps: true });
export default mongoose.model("Mood", moodSchema);
