import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";
import backgroundVideo from "../assets/background.mp4";
import { FaMusic, FaHeart, FaHeadphones, FaPlay } from "react-icons/fa";

const Landing = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: <FaMusic />, title: "Mood Detection", desc: "AI-powered mood analysis from your text" },
    { icon: <FaHeadphones />, title: "Smart Playlists", desc: "Curated music based on your emotions" },
    { icon: <FaHeart />, title: "Personalized", desc: "Music that truly resonates with you" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-container">
      <video autoPlay muted loop className="landing-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="landing-overlay"></div>

      <div className="landing-content">
        <div className="hero-section">
          <div className="logo-container">
            <FaMusic className="logo-icon" />
            <span className="logo-text">MoodSync</span>
          </div>
          
          <h1 className="hero-title">
            Discover Your <span className="gradient-text">Musical Mood</span>
          </h1>
          
          <p className="hero-subtitle">
            Transform your emotions into the perfect soundtrack. 
            Our AI understands your feelings and creates personalized playlists that match your vibe.
          </p>

          <div className="feature-showcase">
            <div className="feature-card active">
              {features[currentFeature].icon}
              <h3>{features[currentFeature].title}</h3>
              <p>{features[currentFeature].desc}</p>
            </div>
          </div>

          <div className="cta-buttons">
            <button 
              className="btn-primary" 
              onClick={() => navigate("/register")}
            >
              <FaPlay className="btn-icon" />
              Get Started
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <FaMusic />
            </div>
            <h3>Smart Detection</h3>
            <p>Advanced AI analyzes your mood from simple text descriptions</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <FaHeadphones />
            </div>
            <h3>Spotify Integration</h3>
            <p>Seamless playback with your Spotify Premium account</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <FaHeart />
            </div>
            <h3>Personalized</h3>
            <p>Music recommendations tailored to your unique taste</p>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </div>
  );
};

export default Landing;
