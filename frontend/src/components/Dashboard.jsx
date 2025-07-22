import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import styles from "../styles/Dashboard.module.css";
import pianoImage from "../assets/piano.jpg";

const API = process.env.REACT_APP_API_BASE_URL; 

const Dashboard = () => {
  const [mood, setMood] = useState("");
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("light");
  const [tracks, setTracks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("User");
  const dropdownRef = useRef();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://moodsync-2-o7ws.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUsername(res.data.name);
        })
        .catch((err) => {
          console.error("Fetch user error:", err);
        })
        .then((res) => {
         console.log("✅ User data from /me:", res.data); // debug
         setUsername(res.data.name);
})

    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  axios.get(`${API}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      setUsername(res.data.name);
    })
    .catch(err => console.log(err));
}, []);


  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://moodsync-2-o7ws.onrender.com/api/moods",
        { mood, language },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTracks(res.data.recommendations);
      alert("Mood saved with Spotify songs!");
    } catch (err) {
      console.error("Save mood error:", err.response?.data || err.message);
      alert("Error saving mood: " + (err.response?.data?.message || "Unexpected error"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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
      {/* === Top Bar with Logo and Profile Icon === */}
      <div className={styles.topBar}>
        <div className={styles.brand}>MoodSync</div>
        <div className={styles.profileSection} ref={dropdownRef}>
          <button
            className={styles.profileBtn}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUserCircle size={28} />
          </button>
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <p><strong>{username}</strong></p>
              <hr />
              <p>🕓 History (Coming soon)</p>
              <button onClick={handleLogout}>🚪 Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* === Main Dashboard Card === */}
      <div className={`${styles.dashboard} ${theme === "dark" ? styles.dark : styles.light}`}>
        <h2 className={styles.transparentWhiteText}>Select Your Mood</h2>

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
          <option value="Telugu">Telugu</option>
          <option value="Tamil">Tamil</option>
        </select>

        <button onClick={handleSubmit}>Save Mood</button>

        <div className={styles.recommendationSection}>
          <h3 className={styles.transparentWhiteText}>🎵 Recommended Songs:</h3>
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
            <p className={styles.transparentWhiteSubtext}>No songs yet. Submit a mood above 👆</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

