import React from "react";
import "../../css/PropertyCard.css";

const PropertyCard = ({ image, price, title, location, bhk, onView, onDelete }) => {
  return (
    <div className="property-card">
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
        <button className="view-button" onClick={onView}>View</button>
        <button className="delete-button" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default PropertyCard;
