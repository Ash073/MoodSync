import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
  const [mood, setMood] = useState("");
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("light");
  const [tracks, setTracks] = useState([]); // NEW: for showing Spotify recommendations

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/moods",
        { mood, language },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTracks(res.data.recommendations); // NEW: show Spotify songs
      alert("Mood saved with Spotify songs!");
    } catch (err) {
      alert("Error saving mood");
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={styles.dashboard}>
      <h2>Select Your Mood</h2>

      <select value={mood} onChange={(e) => setMood(e.target.value)}>
        <option value="">-- Select Mood --</option>
        <option value="Happy">😊 Happy</option>
        <option value="Sad">😢 Sad</option>
        <option value="Angry">😠 Angry</option>
        <option value="Relaxed">😌 Relaxed</option>
      </select>

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="English">English</option>
        <option value="Hindi">Hindi</option>
        <option value="Spanish">Spanish</option>
      </select>

      <button onClick={handleSubmit}>Save Mood</button>

      <br /><br />
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle {theme === "light" ? "🌙 Dark" : "☀️ Light"} Mode
      </button>

      <div className={styles.recommendationSection}>
  <h3>🎵 Recommended Songs:</h3>
  {tracks.length > 0 ? (
    <div className={styles.songGrid}>
      {tracks.map((track, idx) => (
        <div key={idx} className={styles.songCard}>
          <div className={styles.songTitle}>{track.title}</div>
          <div className={styles.songArtist}>{track.artist}</div>
          <a
            href={track.url}
            target="_blank"
            rel="noreferrer"
            className={styles.listenButton}
          >
            ▶️ Listen on Spotify
          </a>
        </div>
      ))}
    </div>
  ) : (
    <p>No songs yet. Submit a mood above 👆</p>
  )}
</div>
    </div>
  );
};

export default Dashboard;
