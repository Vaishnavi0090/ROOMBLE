import React, { useState, useEffect, useContext } from "react";
import "../css/FlatMateCard.css";
import { Basecontext } from "../context/base/Basecontext";

const FlatmateCard = ({ id, name, locality, city, gender, smoke, eatNonVeg, pets, compatibilityScore, image, isBookmarked }) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const { user } = useContext(Basecontext); // Context to get user token

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);
  // const id = {id};
  const toggleBookmark = async () => {
    const newBookmarkState = !bookmarked;
    const token = localStorage.getItem("authtoken");
    console.log(id);
    const requestBody = {
      action: newBookmarkState ? "bookmark" : "unmark",
      thing: "flatmate",
      id,
    };
  
    console.log("Request Body:", requestBody);
  
    if (!token) {
      alert("Authentication token is missing!");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:3000/api/Bookmarking_Routes/edit_bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: token, 
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to update bookmark");
      }
  
      setBookmarked(newBookmarkState);
    } catch (error) {
      console.error("Error updating bookmark:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleView = () => {
    window.location.href = `/tenant/${id}`;
  };
  
  const score = Math.round(parseFloat(compatibilityScore) * 100) || 0;

  return (
    <div className="flatmate-card">
      {/* Card Header */}
      <div className="card-header">
        <img src={image} alt={name} className="profile-pic" />
        <span className="flatmate-name">{name}</span>

        {/* Compatibility Score */}
        <span className="compatibility-score">
          <span className="star-icon">⭐</span> {score}%
        </span>
      </div>

      {/* Card Body */}
      <div className="card-body">
        <p className="location-title">Preferred Location</p>
        <p className="location-text">
          {locality}, {city}
        </p>
      </div>

      {/* Card Footer */}
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

        <button className="view-btn" onClick={handleView}>View</button>
      </div>
    </div>
  );
};

export default FlatmateCard;
