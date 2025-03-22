import React, { useState } from "react";
import "../../css/PropertyCard.css";

const PropertyCardTenant = ({ image, price, title, location, bhk, onView, onBookMark }) => {
  const [isPopping, setIsPopping] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const triggerPop = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 300); // Duration should match CSS animation
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleView = () => {
    triggerPop();
    onView();
  };

  return (
    <div className={`property-card ${isPopping ? "pop-animate" : ""}`}>
      {/* Image Section */}
      <div className="image-container">
        <img src={image} alt={title} />
      </div>

      {/* Details Section */}
      <div className="details">
        <p className="price">{price}</p>
        <p className="description">{title}, {location}</p>
        <p className="bhk">{bhk}</p>
      </div>

      {/* Buttons Section */}
      <div className="buttons">
        <button className="view-button" onClick={handleView}>View</button>
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
      </div>
    </div>
  );
};

export default PropertyCardTenant;
