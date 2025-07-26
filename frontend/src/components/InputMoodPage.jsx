import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InputMoodPage = () => {
  const [inputText, setInputText] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!inputText.trim()) return alert("Please enter your mood.");
    // Save input to localStorage or state manager like Redux
    localStorage.setItem("moodInput", inputText);
    navigate("/select-language");
  };

  return (
    <div className="page-container">
      <h2>How are you feeling today?</h2>
      <textarea
        rows="4"
        placeholder="Describe your mood..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default InputMoodPage;
