import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/login", (req, res) => {
  const scope = "streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state";
  const clientId = (process.env.SPOTIFY_CLIENT_ID || "").trim();
  const redirectUri = (process.env.REDIRECT_URI || "").trim();

  if (!clientId || !redirectUri) {
    return res.status(500).json({
      message: "Missing SPOTIFY_CLIENT_ID or REDIRECT_URI env var",
    });
  }

  const authURL = `https://accounts.spotify.com/authorize?client_id=${encodeURIComponent(
    clientId
  )}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(
    scope
  )}`;

  res.redirect(authURL);
});

router.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  if (!code) {
    return res.status(400).json({ error: "No authorization code provided" });
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const access_token = response.data.access_token;
    const refresh_token = response.data.refresh_token;
    const rawFrontend = process.env.FRONTEND_URL || "http://localhost:5173";
    const frontendBase = rawFrontend.replace(/\/$/, "");
    // Use regular route since we're using HashRouter
    const redirectUrl = `${frontendBase}/#/spotify/callback?access_token=${encodeURIComponent(
      access_token || ""
    )}&refresh_token=${encodeURIComponent(refresh_token || "")}`;

    res.redirect(302, redirectUrl);
  } catch (err) {
    console.error("❌ Spotify callback error:", err.response?.data || err.message);
    res.status(400).json({ 
      error: err.response?.data?.error_description || "Failed to exchange code for token" 
    });
  }
});

// Test endpoint to verify auth routes are working
router.get("/test", (req, res) => {
  res.json({ 
    message: "Auth routes are working!",
    timestamp: new Date().toISOString(),
    env: {
      hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
      hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
      hasRedirectUri: !!process.env.REDIRECT_URI,
      hasFrontendUrl: !!process.env.FRONTEND_URL
    }
  });
});

export default router;
