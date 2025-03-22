import React, { useState, useContext , useEffect} from "react";
import "../css/PropertyDisplay.css";
import { Basecontext } from '../context/base/Basecontext';

const PropertyDisplay = ({ 
  images, price, address, description, amenities, area, onDelist, onDelete, landlord 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const state = useContext(Basecontext);
  const { user, setUser, fetuser } = state;

  useEffect(() => {
    fetuser();
    console.log(user.type);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="property-display-container">
      {/* Left Section - Image Slider */}
      <div className="property-display-left">
        <div className="property-display-image-carousel">
          <button className="property-display-arrow left" onClick={handlePrev}>‹</button>
          <img src={images[currentIndex]} alt="Property" />
          <button className="property-display-arrow right" onClick={handleNext}>›</button>
        </div>
        <div className="property-display-price">₹{price}/Month</div>
        <div className="property-display-location">{address}</div>
      </div>

      {/* Right Section - Property Details */}
      <div className="property-display-right">
        <div className="property-display-section">
          <h3>Description</h3>
          <p>{description}</p>
        </div>
        <div className="property-display-section">
          <h3>Amenities</h3>
          <ul>{amenities.map((item, index) => <li key={index}>{item}</li>)}</ul>
        </div>
        <div className="property-display-section">
          <h3>Area</h3>
          <p>{area} sqft</p>
        </div>
          {user.type === "landlord" ? (
            <div className="property-display-buttons">
              <button className="property-display-delist" onClick={onDelist}>Delist</button>
              <button className="property-display-delete" onClick={onDelete}>Delete</button>
            </div>
          ) : (
            <div className="property-display-section">
              <h3>Landlord</h3>
              <p>{landlord}</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default PropertyDisplay;
