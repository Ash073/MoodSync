import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";

dotenv.config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Request and set a fresh access token
const setAccessToken = async () => {
  try {
    const tokenData = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(tokenData.body.access_token);
    console.log("✅ Spotify access token set");
  } catch (err) {
    console.error("❌ Spotify token error:", err.message);
  }
};

const moodMap = {
  Happy: ["happy", "joyful", "excited", "cheerful", "delighted"],
  Sad: ["sad", "depressed", "down", "blue", "unhappy"],
  Energetic: ["energetic", "pumped", "hyped", "active"],
  Relaxed: ["relaxed", "calm", "chill", "peaceful"],
  Angry: ["angry", "furious", "mad", "irritated"],
  Romantic: ["romantic", "love", "affection", "passionate"],
  Lonely: ["lonely", "alone", "empty", "isolated"],
  Nostalgic: ["nostalgic", "memory", "remember", "sentimental"],
  Hopeful: ["hopeful", "optimistic", "positive", "uplifted"],
  Fearful: ["afraid", "scared", "anxious", "nervous", "worried"],
};

const languageMap = {
  English: { market: "US" },
  Hindi: { market: "IN" },
  Tamil: { market: "IN" },
  Punjabi: { market: "IN" },
  Telugu: { market: "IN" },
};

export const getTracksByMood = async (mood, language = "English") => {
  try {
    // 1️⃣ Ensure valid token
    if (!spotifyApi.getAccessToken()) {
      await setAccessToken();
    }

    // 2️⃣ Build search query
    const keywords = moodMap[mood] || ["pop"];
    const langInfo = languageMap[language] || languageMap.English;
    const query = keywords.join(" ");

    // 3️⃣ Search tracks
    const data = await spotifyApi.searchTracks(query, { limit: 10, market: langInfo.market });

    // 4️⃣ Map tracks for frontend
    return data.body.tracks.items.map(track => ({
      title: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      album: track.album.name || "Unknown Album",
      preview: track.preview_url,
      url: track.external_urls.spotify,
      albumImage: track.album.images?.[0]?.url || "",
    }));
  } catch (err) {
    console.error("❌ Spotify search error:", err.message);
    return [];
  }
};

