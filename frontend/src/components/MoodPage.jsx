import React, { useState, useEffect } from "react";
import styles from "../styles/Dashboard.module.css"; // CSS Module
import { FaMusic } from "react-icons/fa";
import pianoImage from "../assets/piano.jpg";

const MoodPage = () => {
  const [moodInput, setMoodInput] = useState(""); // user-typed input
  const [language, setLanguage] = useState("English");
  const [darkMode, setDarkMode] = useState(false);
  const [recommendedSongs, setRecommendedSongs] = useState([]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const handleSaveMood = () => {
    if (!moodInput.trim()) {
      alert("Please describe your mood!");
      return;
    }

    // Dummy sentiment analysis simulation
    let detectedMood = "Relaxed";
    if (moodInput.toLowerCase().includes("happy")) detectedMood = "Happy";
    else if (moodInput.toLowerCase().includes("sad")) detectedMood = "Sad";
    else if (moodInput.toLowerCase().includes("energetic")) detectedMood = "Energetic";
    else if (moodInput.toLowerCase().includes("angry")) detectedMood = "Angry";

    // Simulated song recommendations
    setRecommendedSongs([
      `🎵 ${detectedMood} vibes - Track 1`,
      `🎶 ${detectedMood} melody - Track 2`,
      `🎧 ${detectedMood} beat - Track 3`,
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
        <h1>🎭 Describe Your Mood</h1>

        <div className={styles.controls}>
          {/* ⬇️ Mood Textarea instead of dropdown */}
          <textarea
            placeholder="How are you feeling today? Write something like 'I feel super energetic and excited!'"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", fontSize: "1rem" }}
          />

          {/* Language dropdown */}
          <select onChange={(e) => setLanguage(e.target.value)} value={language}>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Telugu">Telugu</option>
          </select>

          {/* Save Mood Button */}
          <button onClick={handleSaveMood}>🎼 Save Mood</button>
        </div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className={styles.toggle}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Recommended Songs */}
        <div className={styles.results}>
          <h2><FaMusic /> Recommended Songs:</h2>
          {recommendedSongs.length === 0 ? (
            <p>No songs yet. Describe your mood above 👆</p>
          ) : (
            <ul>
              {recommendedSongs.map((song, idx) => (
                <li key={idx}>{song}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodPage;

