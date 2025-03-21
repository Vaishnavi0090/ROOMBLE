import React, { useState } from "react";
import "../../css/PropertyCard.css";

const PropertyCard = ({ image, price, title, location, bhk, onView, onDelete }) => {
  const [isPopping, setIsPopping] = useState(false);

  const triggerPop = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 300); // Duration should match CSS animation
  };

  const handleView = () => {
    triggerPop();
    onView();
  };

  const handleDelete = () => {
    triggerPop();
    onDelete();
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
        <button className="delete-button" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default PropertyCard;
