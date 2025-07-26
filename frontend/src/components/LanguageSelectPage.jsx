import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LanguageSelectPage = () => {
  const [language, setLanguage] = useState("English");
  const navigate = useNavigate();

  const handleNext = () => {
    localStorage.setItem("language", language);
    navigate("/dashboard");
  };

  return (
    <div className="page-container">
      <h2>Select Your Language</h2>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="English">English</option>
        <option value="Hindi">Hindi</option>
        <option value="Tamil">Tamil</option>
        <option value="Telugu">Telugu</option>
        {/* Add more languages */}
      </select>
      <button onClick={handleNext}>Continue</button>
    </div>
  );
};

export default LanguageSelectPage;
