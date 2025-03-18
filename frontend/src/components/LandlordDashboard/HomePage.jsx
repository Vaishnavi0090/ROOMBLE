import React from "react";
import Navbar from "../Navbar";
import PropertyCard from "./PropertyCard";
import "../../css/LandlordDashboard.css";

const HomePage = () => {
 return (
    <div className="page">
      <Navbar />

      <div className="properties-section">
        <h2 className="properties-heading">Your Properties</h2>
        <div className="heading-underline"></div>

        <div className="property-cards-container">
          {[...Array(5)].map((_, index) => (
            <PropertyCard key={index} />
          ))}
        </div>
      </div>
    </div>
 );
};

export default HomePage;
