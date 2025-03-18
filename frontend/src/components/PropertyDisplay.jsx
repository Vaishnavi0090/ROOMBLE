import React from "react";
import "../css/PropertyDisplay.css";

const PropertyDisplay = ({ 
  image, 
  price, 
  address, 
  description, 
  amenities, 
  area, 
  onDelist, 
  onDelete 
}) => {
  return (
    <div className="property-display-container">
      {/* Left Section - Property Image and Basic Info */}
      <div className="property-display-left">
        <div className="property-display-image-carousel">
          <img src={image} alt="Property" />
        </div>
        <div className="property-display-price">₹{price}/Month</div>
        <div className="property-display-location">{address}</div>
      </div>

      {/* Right Section - Property Details */}
      <div className="property-display-right">
        {/* Description */}
        <div className="property-display-section">
          <h3>Description</h3>
          <p>{description}</p>
        </div>

        {/* Amenities */}
        <div className="property-display-section">
          <h3>Amenities</h3>
          <ul>
            {amenities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Area */}
        <div className="property-display-section">
          <h3>Area</h3>
          <p>{area} sqft</p>
        </div>

        {/* Action Buttons */}
        <div className="property-display-buttons">
          <button className="property-display-delist" onClick={onDelist}>Delist</button>
          <button className="property-display-delete" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDisplay;
