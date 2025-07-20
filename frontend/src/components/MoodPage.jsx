import React, { useState, useEffect } from "react";
import styles from "../styles/Dashboard.module.css"; // Use CSS Module
import { FaMusic } from "react-icons/fa";

const MoodPage = () => {
  const [mood, setMood] = useState("");
  const [language, setLanguage] = useState("English");
  const [darkMode, setDarkMode] = useState(false);
  const [recommendedSongs, setRecommendedSongs] = useState([]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const handleSaveMood = () => {
    if (!mood) return;
    // Simulate song fetch
    setRecommendedSongs([
      `🎵 ${mood} vibes - Track 1`,
      `🎶 ${mood} melody - Track 2`,
      `🎧 ${mood} beat - Track 3`,
    ]);
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
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <h1>🎭 Select Your Mood</h1>

      <div className={styles.controls}>
        <select onChange={(e) => setMood(e.target.value)} value={mood}>
          <option value="">-- Select Mood --</option>
          <option value="Happy">😊 Happy</option>
          <option value="Sad">😢 Sad</option>
          <option value="Energetic">💃 Energetic</option>
          <option value="Relaxed">🧘 Relaxed</option>
        </select>

        <select onChange={(e) => setLanguage(e.target.value)} value={language}>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Tamil">Tamil</option>
          <option value="Punjabi">Punjabi</option>
        </select>

        <button onClick={handleSaveMood}>🎼 Save Mood</button>
      </div>

      <button onClick={toggleTheme} className={styles.toggle}>
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className={styles.results}>
        <h2>
          <FaMusic /> Recommended Songs:
        </h2>
        {recommendedSongs.length === 0 ? (
          <p>No songs yet. Submit a mood above 👆</p>
        ) : (
          <ul>
            {recommendedSongs.map((song, idx) => (
              <li key={idx}>{song}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MoodPage;
