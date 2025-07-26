import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";
import { FaMusic } from "react-icons/fa";
import pianoImage from "../assets/piano.jpg";

const MoodPage = () => {
  const [moodInput, setMoodInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [darkMode, setDarkMode] = useState(false);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [detectedMood, setDetectedMood] = useState("");

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const handleSaveMood = async () => {
    if (!moodInput.trim()) {
      alert("Please describe your mood!");
      return;
    }

    try {
      const res = await axios.post("/api/moods", {
        moodSentence: moodInput,
        language,
      });

      setRecommendedSongs(res.data.recommendations || []);
      setDetectedMood(res.data.mood);
    } catch (error) {
      console.error("❌ Error saving mood:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      document.body.style.transition = "background 5s ease";
      const colors = ["#fceabb", "#e0c3fc", "#a1c4fd", "#fbc2eb", "#fad0c4"];
      document.body.style.background = `linear-gradient(120deg, ${
        colors[Math.floor(Math.random() * colors.length)]
      }, white)`;
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={styles.dashboardContainer}
      style={{
        backgroundImage: `url(${pianoImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>

        {/* 🔵 Logo/Brand Name */}
        <div className={styles.logo}>
          <h2>MoodSync 🎧</h2>
        </div>

        <h1>🎭 Describe Your Mood</h1>

        <div className={styles.controls}>
          <textarea
            placeholder="How are you feeling today? Write something like 'I feel super energetic and excited!'"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", fontSize: "1rem" }}
          />

          <select onChange={(e) => setLanguage(e.target.value)} value={language}>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Telugu">Telugu</option>
          </select>

          <button onClick={handleSaveMood}>🎼 Save Mood</button>
        </div>

        <button onClick={toggleTheme} className={styles.toggle}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

        <div className={styles.results}>
          <h2><FaMusic /> Recommended Songs:</h2>
          {recommendedSongs.length === 0 ? (
            <p>No songs yet. Describe your mood above 👆</p>
          ) : (
            <ul>
              {recommendedSongs.map((track, idx) => (
                <li key={idx} style={{ marginBottom: "12px" }}>
                  <a href={track.url} target="_blank" rel="noopener noreferrer">
                    🎵 {track.title} — {track.artist}
                  </a>
                  <br />
                  {track.preview && (
                    <audio controls src={track.preview} style={{ marginTop: "4px", width: "100%" }} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodPage;
