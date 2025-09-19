import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import backgroundVideo from "../assets/background1.mp4";
import { FaMusic, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/users/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <video autoPlay muted loop className="bg-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="login-overlay"></div>

      <div className="login-content">
        <button 
          className="back-button" 
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
        </button>

        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <FaMusic className="logo-icon" />
              <span className="logo-text">MoodSync</span>
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to continue your musical journey</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

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
                  placeholder="Enter your password"
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
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <span 
                className="register-link" 
                onClick={() => navigate("/register")}
              >
                Create one here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
