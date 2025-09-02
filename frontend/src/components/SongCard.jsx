import React from "react";

const SongCard = ({ name, artist, albumImage, spotifyUrl }) => {
  return (
    <div className="song-card">
      <img
        src={albumImage || "/default-song.png"}
        alt={name}
        className="song-image"
      />
      <h4>{name}</h4>
      <p>{artist}</p>
      {spotifyUrl ? (
        <a href={spotifyUrl} target="_blank" rel="noopener noreferrer">
          Listen on Spotify
        </a>
      ) : (
        <p>No Spotify link available</p>
      )}
    </div>
  );
};

export default SongCard;
