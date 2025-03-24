import React, { useState } from "react";
import "../../css/PropertyCard.css";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({
  image,
  price,
  title,
  location,
  bhk,
  id,
  available,
}) => {

  const navigate = useNavigate();

  const handleView = () => {
    console.log("navigate to:", id);
    navigate(`/property/${id}`);
  };
  console.log("available:", available);


  return (
    <div className={`property-card ${available ? "" : "delisted"}`}>
      {/* Image Section */}
      <div className="image-container">
        <img src={image} />
      </div>

      {/* Details Section */}
      <div className="details">
        <p className="price">Price : {price}</p>
        <p className="description">
          {location}
        </p>
        <p className="bhk">BHK : {bhk}</p>
      </div>

      {/* Buttons Section */}
      <div className="buttons">
        <button className={`view-button ${available?"":"delisted"}`} onClick={handleView}>
          View
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
