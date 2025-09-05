import React, { useEffect, useRef, useState } from "react";

const SDK_URL = "https://sdk.scdn.co/spotify-player.js";

const SpotifyPlayer = ({ token }) => {
  const [player, setPlayer] = useState(null);
  const [sdkReady, setSdkReady] = useState(!!window.Spotify);
  const scriptInjectedRef = useRef(false);

  // Inject SDK script once and set the global ready callback
  useEffect(() => {
    if (sdkReady) return;

    // Define the global callback BEFORE the script loads to satisfy SDK expectation
    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        setSdkReady(true);
      };
    }

    // If SDK is already available (cached/previously loaded)
    if (window.Spotify) {
      setSdkReady(true);
      return;
    }

    if (scriptInjectedRef.current) return;

    const existing = document.querySelector(`script[src="${SDK_URL}"]`);
    if (existing) {
      scriptInjectedRef.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    document.body.appendChild(script);
    scriptInjectedRef.current = true;
  }, [sdkReady]);

  // Initialize player when SDK and token are available
  useEffect(() => {
    if (!sdkReady || !token) return;

    const sp = new window.Spotify.Player({
      name: "MoodSync Player",
      getOAuthToken: (cb) => cb(token),
      volume: 0.5,
    });

    sp.addListener("ready", ({ device_id }) => {
      console.log("✅ Spotify Web Playback ready. Device ID:", device_id);
    });
    sp.addListener("not_ready", ({ device_id }) => {
      console.log("⚠️ Device has gone offline", device_id);
    });
    sp.addListener("initialization_error", ({ message }) => {
      console.error("Initialization error:", message);
    });
    sp.addListener("authentication_error", ({ message }) => {
      console.error("Authentication error:", message);
    });
    sp.addListener("account_error", ({ message }) => {
      console.error("Account error:", message);
    });

    sp.connect();
    setPlayer(sp);

    return () => {
      sp.disconnect();
      setPlayer(null);
    };
  }, [sdkReady, token]);

  const needsUserToken = !token;

  return (
    <div>
      {needsUserToken ? (
        <span>Spotify Player needs a valid user access token.</span>
      ) : (
        <span>🎵 Spotify Player is {player ? "Ready" : "Loading..."}</span>
      )}
    </div>
  );
};

export default SpotifyPlayer;
