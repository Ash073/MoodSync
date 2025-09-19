import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import styles from "../styles/Dashboard.module.css";
import { FaMusic, FaUserCircle } from "react-icons/fa";
import SpotifyPlayer from "../components/SpotifyPlayer";

const MoodPage = () => {
  const navigate = useNavigate();
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

  const getSpotifyAuthUrl = () => {
    const base = (api.defaults.baseURL || "").replace(/\/$/, "").replace(/\/api$/, "");
    const url = `${base}/api/auth/login`;
    try { console.log("➡️ Spotify auth URL:", url); } catch (_) {}
    return url;
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
      console.log("🎯 Frontend - Sending mood and language:", { 
        moodInput, 
        language,
        timestamp: new Date().toISOString()
      });

      const res = await api.post("/moods", { moodSentence: moodInput, language });

      console.log("✅ Frontend - Received response:", {
        detectedMood: res.data.detectedMood,
        recommendationsCount: res.data.recommendations?.length || 0,
        sampleTracks: res.data.recommendations?.slice(0, 3).map(t => `${t.title} by ${t.artist}`) || []
      });

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

  // Click outside handler for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfile && !event.target.closest(`.${styles.profileContainer}`)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfile]);

  return (
    <>
      {/* Enhanced Profile dropdown */}
      <div className={styles.profileContainer}>
        <button 
          className={styles.profileButton}
          onClick={() => setShowProfile((prev) => !prev)}
        >
          <FaUserCircle className={styles.profileIcon} />
          <span className={styles.profileText}>Profile</span>
        </button>
        
        {showProfile && userProfile && (
          <div className={styles.profileDropdown}>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>
                <FaUserCircle className={styles.avatarIcon} />
              </div>
              <div className={styles.profileInfo}>
                <h3 className={styles.profileName}>{userProfile.name}</h3>
                <p className={styles.profileEmail}>{userProfile.email}</p>
              </div>
            </div>

            <div className={styles.profileStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{userProfile.moods?.length || 0}</span>
                <span className={styles.statLabel}>Moods Tracked</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  {userProfile.moods?.reduce((total, mood) => total + (mood.recommendations?.length || 0), 0) || 0}
                </span>
                <span className={styles.statLabel}>Songs Discovered</span>
              </div>
            </div>

            <div className={styles.moodHistory}>
              <h4 className={styles.historyTitle}>
                <FaMusic className={styles.historyIcon} />
                Recent Moods & Songs
              </h4>
              <div className={styles.historyList}>
                {userProfile.moods?.length === 0 ? (
                  <div className={styles.emptyHistory}>
                    <p>No moods tracked yet</p>
                    <p className={styles.emptySubtext}>Start by describing your mood above!</p>
                  </div>
                ) : (
                  userProfile.moods.slice(0, 5).map((mood, idx) => (
                    <div key={idx} className={styles.moodItem}>
                      <div className={styles.moodHeader}>
                        <span className={styles.moodType}>{mood.mood}</span>
                        <span className={styles.moodDate}>
                          {new Date(mood.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.moodDetails}>
                        <span className={styles.moodLanguage}>🌍 {mood.language}</span>
                        <span className={styles.songCount}>
                          🎵 {mood.recommendations?.length || 0} songs
                        </span>
                      </div>
                      {mood.recommendations && mood.recommendations.length > 0 && (
                        <div className={styles.recentSongs}>
                          {mood.recommendations.slice(0, 2).map((song, songIdx) => (
                            <div key={songIdx} className={styles.songPreview}>
                              <img 
                                src={song.albumImage} 
                                alt={song.title}
                                className={styles.songThumbnail}
                              />
                              <div className={styles.songInfo}>
                                <p className={styles.songTitle}>{song.title}</p>
                                <p className={styles.songArtist}>{song.artist}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={styles.profileActions}>
              <button 
                className={styles.logoutButton}
                onClick={() => {
                  // Clear all stored tokens
                  localStorage.removeItem("token");
                  localStorage.removeItem("spotify_user_access_token");
                  localStorage.removeItem("spotify_user_refresh_token");
                  
                  // Close profile dropdown
                  setShowProfile(false);
                  
                  // Redirect to login page
                  navigate("/login");
                }}
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
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
            <h2>MoodSync</h2>
          </div>

          <div className={styles.heroSection}>
            <h1 className={styles.heroTitle}>
              🎭 Describe Your <span className={styles.gradientText}>Mood</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Share how you're feeling and let our AI create the perfect soundtrack for your emotions
            </p>
          </div>

          {/* Mood input */}
          <div className={styles.controls}>
            <div className={styles.inputContainer}>
            <textarea
                placeholder="How are you feeling today? Write something like 'I feel super energetic and excited!' or 'I'm feeling a bit sad and need some comfort music'"
              value={moodInput}
              onChange={(e) => setMoodInput(e.target.value)}
              rows={4}
                className={styles.moodTextarea}
              />
              <div className={styles.characterCount}>
                {moodInput.length}/500
              </div>
            </div>

            <div className={styles.languageContainer}>
              <label className={styles.languageLabel}>
                Language: <span className={styles.selectedLanguage}>{language}</span>
              </label>
              <select 
                onChange={(e) => {
                  console.log("🌍 Language changed to:", e.target.value);
                  setLanguage(e.target.value);
                }} 
                value={language}
                className={styles.languageSelect}
              >
                <option value="English">🇺🇸 English</option>
                <option value="Hindi">🇮🇳 Hindi</option>
                <option value="Tamil">🇮🇳 Tamil</option>
                <option value="Punjabi">🇮🇳 Punjabi</option>
                <option value="Telugu">🇮🇳 Telugu</option>
            </select>
            </div>

            <button 
              onClick={handleSaveMood} 
              disabled={loading || !moodInput.trim()}
              className={styles.saveButton}
            >
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <span>Analyzing your mood...</span>
                </div>
              ) : (
                <div className={styles.buttonContent}>
                  <span>🎼</span>
                  <span>Discover My Music</span>
                </div>
              )}
            </button>
          </div>

          <button onClick={toggleTheme} className={styles.toggle}>
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Detected Mood Display */}
          {detectedMood && (
            <div className={styles.moodDisplay}>
              <div className={styles.moodCard}>
                <div className={styles.moodIcon}>🎭</div>
                <div className={styles.moodInfo}>
                  <h3>Detected Mood</h3>
                  <p className={styles.moodValue}>{detectedMood}</p>
                </div>
              </div>
            </div>
          )}

          {/* Recommended songs */}
          <div className={styles.results}>
            <div className={styles.resultsHeader}>
              <h2>
                <FaMusic className={styles.resultsIcon} />
                Your Personalized Playlist
              </h2>
              {recommendedSongs.length > 0 && (
                <p className={styles.resultsSubtitle}>
                  {recommendedSongs.length} songs that match your mood
                </p>
      )}
    </div>

            {recommendedSongs.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🎵</div>
                <h3>No songs yet</h3>
                <p>Describe your mood above to discover your perfect soundtrack</p>
              </div>
            ) : (
              <div className={styles.songsGrid}>
                {recommendedSongs.map((track, idx) => (
                  <div key={idx} className={styles.songCard}>
                    <div className={styles.songImageContainer}>
                      <img
                        src={track.albumImage}
                        alt={track.title}
                        className={styles.songImage}
                      />
                      <div className={styles.playOverlay}>
                        <span>▶️</span>
                      </div>
                    </div>
                    <div className={styles.songInfo}>
                      <h4 className={styles.songTitle}>{track.title}</h4>
                      <p className={styles.songArtist}>{track.artist}</p>
                    {track.album && (
                        <p className={styles.songAlbum}>{track.album}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
                <a href={getSpotifyAuthUrl()} style={{
                  display: "inline-block",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  background: "#1DB954",
                  color: "#fff",
                  textDecoration: "none"
                }}>Connect Spotify</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoodPage;

