import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import backgroundVideo from "../assets/background1.mp4";
import { FaMusic, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/users/register", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      console.error("Registration error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <video autoPlay muted loop className="bg-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="register-overlay"></div>

      <div className="register-content">
        <button 
          className="back-button" 
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
        </button>

        <div className="register-card">
          <div className="register-header">
            <div className="logo">
              <FaMusic className="logo-icon" />
              <span className="logo-text">MoodSync</span>
            </div>
            <h1>Join the Music</h1>
            <p>Create your account and start discovering music that matches your mood</p>
          </div>

          <form onSubmit={handleRegister} className="register-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="input-group">
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="register-button"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{" "}
              <span 
                className="login-link" 
                onClick={() => navigate("/login")}
              >
                Sign in here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

