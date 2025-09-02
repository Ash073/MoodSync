import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";
import { FaMusic, FaUserCircle } from "react-icons/fa";
import pianoImage from "../assets/piano.jpg";

const MoodPage = () => {
  const [moodInput, setMoodInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [darkMode, setDarkMode] = useState(false);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [detectedMood, setDetectedMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const handleSaveMood = async () => {
    if (!moodInput.trim()) {
      alert("Please describe your mood!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userToken = localStorage.getItem("token"); // your JWT
      const res = await axios.post(
        "http://localhost:5000/api/moods",
        { moodSentence: moodInput, language },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      // Set mood and recommendations
      setDetectedMood(res.data.detectedMood || "");
      setRecommendedSongs(res.data.recommendations || []);
    } catch (err) {
      console.error("❌ Error saving mood:", err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
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

  useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(res.data);
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
    }
  };

  fetchUserProfile();
}, []);

  return (
    <><div style={{ position: "absolute", top: "20px", right: "20px" }}>
      <FaUserCircle
        size={30}
        style={{ cursor: "pointer" }}
        onClick={() => setShowProfile(prev => !prev)} />

      {showProfile && userProfile && (
        <div style={{
          position: "absolute",
          top: "40px",
          right: "0",
          width: "250px",
          backgroundColor: darkMode ? "#333" : "#fff",
          color: darkMode ? "#fff" : "#000",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          zIndex: 1000,
        }}>
          <h3>{userProfile.name}</h3>
          <h4>Mood History:</h4>
          <ul style={{ maxHeight: "200px", overflowY: "auto", padding: "0 10px" }}>
            {userProfile.moods.length === 0 ? (
              <li>No moods yet</li>
            ) : (
              userProfile.moods.map((mood, idx) => (
                <li key={idx}>
                  {mood.mood} — {new Date(mood.createdAt).toLocaleDateString()}
                </li>
              ))
            )}
          </ul>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload(); // simple logout
            } }
            style={{ marginTop: "10px" }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
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
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "1rem",
              }} />

            <select onChange={(e) => setLanguage(e.target.value)} value={language}>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Telugu">Telugu</option>
            </select>

            <button onClick={handleSaveMood} disabled={loading}>
              {loading ? "🎼 Saving..." : "🎼 Save Mood"}
            </button>
          </div>

          <button onClick={toggleTheme} className={styles.toggle}>
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className={styles.results}>
            <h2>
              <FaMusic /> Recommended Songs:
            </h2>
            {recommendedSongs.length === 0 ? (
              <p>No songs yet. Describe your mood above 👆</p>
            ) : (
              <ul>
                {recommendedSongs.map((track, idx) => (
                  <li key={idx} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {track.albumImage && (
                        <img
                          src={track.albumImage}
                          alt={track.album || "Album Cover"}
                          style={{ width: 60, height: 60, borderRadius: 4 }} />
                      )}
                      <div>
                        <a
                          href={track.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontWeight: "bold", fontSize: "1rem" }}
                        >
                          🎵 {track.title}
                        </a>
                        <p style={{ margin: 0 }}>{track.artist}</p>
                        {track.album && (
                          <p style={{ margin: 0, fontStyle: "italic" }}>{track.album}</p>
                        )}
                        {track.preview && (
                          <audio
                            controls
                            src={track.preview}
                            style={{ marginTop: "4px", width: "100%" }} />
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div></>
  );
};

export default MoodPage;

