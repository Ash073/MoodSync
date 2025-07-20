import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";
import backgroundVideo from "../assets/background.mp4";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <video autoPlay muted loop className="landing-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="landing-content">
        <h1>🎶 Discover Your <span className="strike">Mood</span></h1>
         <p>Unlock your perfect playlist by selecting the mood that matches your current vibe.</p>

        <div className="landing-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
