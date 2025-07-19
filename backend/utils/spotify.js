// backend/utils/spotify.js
import axios from "axios";
import qs from "qs";

let accessToken = null;
let expiresAt = null;

const getAccessToken = async () => {
  if (accessToken && Date.now() < expiresAt) {
    return accessToken;
  }

  const tokenUrl = "https://accounts.spotify.com/api/token";
  const data = qs.stringify({ grant_type: "client_credentials" });

  const authHeader = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await axios.post(tokenUrl, data, {
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  accessToken = res.data.access_token;
  expiresAt = Date.now() + res.data.expires_in * 1000;

  return accessToken;
};

export const getTracksByMood = async (mood, language = "English") => {
  const token = await getAccessToken();

  const q = `${mood} ${language}`;
  const res = await axios.get(`https://api.spotify.com/v1/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      q,
      type: "track",
      limit: 5,
    },
  });

  return res.data.tracks.items.map((track) => ({
    title: track.name,
    artist: track.artists[0].name,
    url: track.external_urls.spotify,
  }));
};

module.exports = { getTracksByMood };
