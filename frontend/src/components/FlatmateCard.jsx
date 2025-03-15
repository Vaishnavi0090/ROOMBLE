import React, { useState } from "react";
import "../css/FlatMateCard.css";

const FlatmateCard = ({ name, image, location }) => {
  const [bookmarked, setBookmarked] = useState(false);

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <div className="flatmate-card">
      <div className="card-header">
        <img src={image} alt={name} className="profile-pic" />
        <span className="flatmate-name">{name}</span>
      </div>

      <div className="card-body">
        <p className="location-title">Preferred Location</p>
        <p className="location-text">{location}</p>
      </div>

      <div className="card-footer">
        <button className="bookmark-btn" onClick={toggleBookmark}>
          {bookmarked ? (
            <svg width="40" height="40" viewBox="0 0 30 30" fill="#8b1e2f">
              <path d="M6 3c-1.1 0-2 .9-2 2v16l8-5 8 5V5c0-1.1-.9-2-2-2H6z"></path>
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 30 30" fill="none" stroke="#8b1e2f" strokeWidth="2">
              <path d="M6 3c-1.1 0-2 .9-2 2v16l8-5 8 5V5c0-1.1-.9-2-2-2H6z"></path>
            </svg>
          )}
        </button>

        <button className="view-btn">View</button>
      </div>
    </div>
  );
};

export default FlatmateCard;
