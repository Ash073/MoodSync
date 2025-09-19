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
  Happy: ["happy", "joyful", "excited", "cheerful", "delighted", "upbeat", "festive"],
  Sad: ["sad", "depressed", "down", "blue", "unhappy", "melancholy", "sorrowful"],
  Energetic: ["energetic", "pumped", "hyped", "active", "dynamic", "powerful"],
  Relaxed: ["relaxed", "calm", "chill", "peaceful", "serene", "mellow"],
  Angry: ["angry", "furious", "mad", "irritated", "aggressive", "intense"],
  Romantic: ["romantic", "love", "affection", "passionate", "intimate", "sweet"],
  Lonely: ["lonely", "alone", "empty", "isolated", "solitary"],
  Nostalgic: ["nostalgic", "memory", "remember", "sentimental", "retro"],
  Hopeful: ["hopeful", "optimistic", "positive", "uplifted", "inspiring"],
  Fearful: ["afraid", "scared", "anxious", "nervous", "worried", "tense"],
};

const languageMap = {
  English: { 
    market: "US", 
    keywords: ["english", "american", "british"], 
    genres: ["pop", "rock", "indie", "alternative", "electronic"],
    artists: ["taylor swift", "ed sheeran", "ariana grande", "drake", "billie eilish"]
  },
  Hindi: { 
    market: "IN", 
    keywords: ["hindi", "bollywood", "indian", "hindi songs", "bollywood music"], 
    genres: ["bollywood", "indian pop", "filmi", "indian classical"],
    artists: ["arijit singh", "shreya ghoshal", "kumar sanu", "lata mangeshkar", "kishore kumar"]
  },
  Tamil: { 
    market: "IN", 
    keywords: ["tamil", "kollywood", "tamil songs", "tamil music", "south indian"], 
    genres: ["tamil", "kollywood", "south indian", "tamil pop"],
    artists: ["ar rahman", "harris jayaraj", "yuvan shankar raja", "gv prakash", "anirudh"]
  },
  Punjabi: { 
    market: "IN", 
    keywords: ["punjabi", "bhangra", "punjabi songs", "punjabi music", "desi"], 
    genres: ["bhangra", "punjabi pop", "desi", "punjabi folk"],
    artists: ["diljit dosanjh", "gurdas maan", "jassi gill", "ammy virk", "hardy sandhu"]
  },
  Telugu: { 
    market: "IN", 
    keywords: ["telugu", "tollywood", "telugu songs", "telugu music", "south indian"], 
    genres: ["telugu", "tollywood", "south indian", "telugu pop"],
    artists: ["ar rahman", "devi sri prasad", "thaman", "mm keeravani", "anup rubens"]
  },
};

export const getTracksByMood = async (mood, language = "English") => {
  try {
    // 1️⃣ Ensure valid token
    if (!spotifyApi.getAccessToken()) {
      await setAccessToken();
    }

    const moodKeywords = moodMap[mood] || ["pop"];
    const langInfo = languageMap[language] || languageMap.English;
    
    console.log(`🎯 Searching for ${mood} mood in ${language} language`);
    console.log(`🌍 Market: ${langInfo.market}`);
    console.log(`🎵 Mood keywords:`, moodKeywords);
    console.log(`🔤 Language keywords:`, langInfo.keywords);
    console.log(`🎭 Genres:`, langInfo.genres);
    console.log(`👤 Artists:`, langInfo.artists);

    // 2️⃣ First try Spotify Recommendations API with language seed genres + mood targets
    const moodTargets = (() => {
      const defaults = { target_valence: 0.5, target_energy: 0.5, target_danceability: 0.5 };
      switch (mood) {
        case "Happy":
          return { target_valence: 0.85, target_energy: 0.7, target_danceability: 0.7 };
        case "Energetic":
          return { target_energy: 0.9, target_danceability: 0.75, min_tempo: 110 };
        case "Relaxed":
          return { target_energy: 0.3, target_acousticness: 0.6, max_tempo: 90 };
        case "Sad":
          return { target_valence: 0.2, target_energy: 0.35 };
        case "Angry":
          return { target_energy: 0.95, min_tempo: 120 };
        case "Romantic":
          return { target_valence: 0.7, target_danceability: 0.6 };
        default:
          return defaults;
      }
    })();

    try {
      const seedGenres = (langInfo.genres && langInfo.genres.length > 0)
        ? langInfo.genres.slice(0, 2)
        : ["pop"];

      const recs = await spotifyApi.getRecommendations({
        limit: 10,
        market: langInfo.market,
        seed_genres: seedGenres,
        ...moodTargets,
      });

      const recTracks = (recs.body.tracks || []).map(track => ({
        title: track.name,
        artist: track.artists.map(a => a.name).join(", "),
        album: track.album?.name || "Unknown Album",
        preview: track.preview_url,
        url: track.external_urls?.spotify,
        albumImage: track.album?.images?.[0]?.url || "",
      }));

      console.log(`🎯 Recommendations API returned ${recTracks.length} tracks for ${language} (${seedGenres.join(", ")})`);
      if (recTracks.length > 0) {
        return recTracks;
      }
    } catch (recErr) {
      console.log("⚠️ Recommendations API failed, falling back to search:", recErr.message);
    }

    // 3️⃣ Try multiple search strategies in order of preference
    const searchStrategies = [
      // Strategy 1: Language artists + mood + language keywords
      {
        name: "Language Artists + Mood + Keywords",
        query: [...langInfo.artists.slice(0, 2), ...moodKeywords.slice(0, 2), ...langInfo.keywords.slice(0, 2)].join(" "),
        priority: 1
      },
      // Strategy 2: Language genres + mood
      {
        name: "Language Genres + Mood",
        query: [...langInfo.genres.slice(0, 2), ...moodKeywords.slice(0, 2)].join(" "),
        priority: 2
      },
      // Strategy 3: Language keywords + mood
      {
        name: "Language Keywords + Mood",
        query: [...langInfo.keywords.slice(0, 3), ...moodKeywords.slice(0, 2)].join(" "),
        priority: 3
      },
      // Strategy 4: Just language artists
      {
        name: "Language Artists Only",
        query: langInfo.artists.slice(0, 3).join(" "),
        priority: 4
      },
      // Strategy 5: Just language genres
      {
        name: "Language Genres Only",
        query: langInfo.genres.slice(0, 3).join(" "),
        priority: 5
      },
      // Strategy 6: Just language keywords
      {
        name: "Language Keywords Only",
        query: langInfo.keywords.slice(0, 3).join(" "),
        priority: 6
      },
      // Strategy 7: Mood + language market
      {
        name: "Mood + Language Market",
        query: moodKeywords.slice(0, 3).join(" "),
        priority: 7
      }
    ];

    // 4️⃣ Try each strategy until we get results
    for (const strategy of searchStrategies) {
      try {
        console.log(`🔄 Trying Strategy ${strategy.priority}: ${strategy.name}`);
        console.log(`🔍 Query: "${strategy.query}"`);
        
        const data = await spotifyApi.searchTracks(strategy.query, { 
          limit: 10, 
          market: langInfo.market 
        });

        console.log(`📊 Found ${data.body.tracks.items.length} tracks with this strategy`);

        if (data.body.tracks.items.length > 0) {
          const tracks = data.body.tracks.items.map(track => ({
            title: track.name,
            artist: track.artists.map(a => a.name).join(", "),
            album: track.album.name || "Unknown Album",
            preview: track.preview_url,
            url: track.external_urls.spotify,
            albumImage: track.album.images?.[0]?.url || "",
          }));

          console.log(`✅ Success with Strategy ${strategy.priority}: ${strategy.name}`);
          console.log(`🎵 Sample tracks:`, tracks.slice(0, 3).map(t => `${t.title} by ${t.artist}`));
          
          return tracks;
        }
      } catch (strategyError) {
        console.log(`⚠️ Strategy ${strategy.priority} failed:`, strategyError.message);
        continue;
      }
    }

    // 5️⃣ If all strategies fail, return empty array
    console.log(`❌ All search strategies failed for ${language}`);
    return [];

  } catch (err) {
    console.error("❌ Spotify search error:", err.message);
    return [];
  }
};

