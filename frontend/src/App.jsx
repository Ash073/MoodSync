import { HashRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import InputMoodPage from "./components/InputMoodPage";
import LanguageSelectPage from "./components/LanguageSelectPage";
import Dashboard from "./components/MoodPage";
import SpotifyCallback from "./components/SpotifyCallback";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/input-mood" element={<InputMoodPage />} />
        <Route path="/select-language" element={<LanguageSelectPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/spotify/callback" element={<SpotifyCallback />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
