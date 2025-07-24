import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import backgroundVideo from "../assets/background1.mp4";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://moodsync-2-o7ws.onrender.com/api/users/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Registration failed");
      console.error("Registration error:", err.response?.data || err.message); 
    }
  };

  return (
    <div className="register-container">
      <video autoPlay muted loop className="bg-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            required
          />
          <button type="submit">Register</button>
        </form>
        <div className="login-link" onClick={() => navigate("/")}>
          Already have an account? Login
        </div>
      </div>
    </div>
  );
};

export default Register;

