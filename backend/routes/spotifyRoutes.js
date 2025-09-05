import express from "express";
import dotenv from "dotenv";
import SpotifyWebApi from "spotify-web-api-node";

dotenv.config();

const router = express.Router();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

router.get("/token", async (req, res) => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    res.json({ access_token: data.body.access_token, expires_in: data.body.expires_in });
  } catch (err) {
    const message = err?.body?.error_description || err?.message || "Failed to get Spotify token";
    console.error("❌ Spotify token fetch failed:", message);
    res.status(500).json({ message });
  }
});

export default router;


