import React from "react";
import "../../css/PropertyCard.css";
import propertyImage from "../../../public/1111111.jpg";

const PropertyCard = () => {
  return (
    <div className="property-card">
       {/* Image Section */} 
      <div className="image-container">
        <img src={propertyImage} alt="Property" />
      </div>
       
       {/* Details Section */}
      <div className="details">
        <p className="price">₹5990/month</p>
        <p className="description">
          Dutta’s Supreme Residency, Mall Road, Shimla, India
        </p>
        <p className="bhk">3BHK</p>
      </div>
        {/* Buttons Section */}
      <div className="buttons">
        <button className="view-button">View</button>
        <button className="delete-button">Delete</button>
      </div>
    </div>
  );
};

export default PropertyCard;
