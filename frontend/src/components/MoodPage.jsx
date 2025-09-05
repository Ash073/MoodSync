import React, { useState, useEffect } from "react";
import api from "../utils/api";
import styles from "../styles/Dashboard.module.css";
import { FaMusic, FaUserCircle } from "react-icons/fa";
import SpotifyPlayer from "../components/SpotifyPlayer";

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
  const [spotifyToken, setSpotifyToken] = useState("");

  const connectSpotify = () => {
    window.location.href = "http://moodsync-12.onrender:5000/api/auth/login";
  };

  // 🌗 Toggle theme
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // 🎭 Save mood & fetch recommendations
  const handleSaveMood = async () => {
    if (!moodInput.trim()) {
      alert("Please describe your mood!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Sending mood and language:", { moodInput, language });

      const res = await api.post("/moods", { moodSentence: moodInput, language });

      setDetectedMood(res.data.detectedMood || "");
      setRecommendedSongs(res.data.recommendations || []);
    } catch (err) {
      console.error("❌ Error saving mood:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Background gradient animation
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

  // 👤 Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setUserProfile(res.data);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };
    fetchUserProfile();
  }, []);

  // 🎶 Load Spotify user token from storage (set by OAuth callback)
  useEffect(() => {
    const t = localStorage.getItem("spotify_user_access_token") || "";
    setSpotifyToken(t);
  }, []);

  return (
    <>
      {/* Profile dropdown */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <FaUserCircle
          size={30}
          style={{ cursor: "pointer" }}
          onClick={() => setShowProfile((prev) => !prev)}
        />
        {showProfile && userProfile && (
          <div
            style={{
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
            }}
          >
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
                window.location.reload();
              }}
              style={{ marginTop: "10px" }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Main container */}
      <div
        className={styles.dashboardContainer}
        style={{
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

          {/* Mood input */}
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
              }}
            />

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

          {/* Recommended songs */}
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
                    <img
                      src={track.albumImage}
                      alt={track.title}
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "4px",
                        marginRight: "8px",
                      }}
                    />
                    <strong>🎵 {track.title}</strong>
                    <p style={{ margin: 0 }}>{track.artist}</p>
                    {track.album && (
                      <p style={{ margin: 0, fontStyle: "italic" }}>{track.album}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 🎶 Spotify Web Playback Player */}
          <div style={{ marginTop: "30px" }}>
            <h2>Spotify Player</h2>
            {spotifyToken ? (
              <SpotifyPlayer token={spotifyToken} />
            ) : (
              <div>
                <p>Connect your Spotify account to enable playback.</p>
                <button onClick={connectSpotify}>Connect Spotify</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoodPage;

