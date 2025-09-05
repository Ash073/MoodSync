import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get("access_token");
    const refreshToken = url.searchParams.get("refresh_token");

    if (accessToken) {
      localStorage.setItem("spotify_user_access_token", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("spotify_user_refresh_token", refreshToken);
    }
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return <div>Connecting your Spotify account...</div>;
};

export default SpotifyCallback;


