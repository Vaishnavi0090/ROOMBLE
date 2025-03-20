import React from "react";
import PropertyCard from "./PropertyCard";
import "../../css/LandlordDashboard.css";
import samplePropertyImg from "../../../public/1111111.jpg"; // Sample image

const HomePage = () => {
  const properties = [
    { 
      title: "Dutta’s Supreme Residency", 
      image: samplePropertyImg, 
      location: "Mall Road, Shimla, India", 
      price: "₹5990/month", 
      bhk: "3BHK" 
    },
    { 
      title: "Giridhari’s Apartments", 
      image: samplePropertyImg, 
      location: "Vagator Beach, Goa, India", 
      price: "₹10099/month", 
      bhk: "3BHK" 
    },
    { 
      title: "Sunrise Villa", 
      image: samplePropertyImg, 
      location: "MG Road, Bangalore, India", 
      price: "₹8500/month", 
      bhk: "2BHK" 
    },
    { 
      title: "The Grand Heights", 
      image: samplePropertyImg, 
      location: "Sector 21, Gurgaon, India", 
      price: "₹12000/month", 
      bhk: "4BHK" 
    },
    { 
      title: "Pearl Residency", 
      image: samplePropertyImg, 
      location: "Anna Nagar, Chennai, India", 
      price: "₹7500/month", 
      bhk: "3BHK" 
    }
  ];

  return (
    <div className="page">
      <div className="properties-section">
        <h2 className="properties-heading">Your Properties</h2>
        <div className="heading-underline"></div>

        <div className="property-cards-container">
          {properties.map((property, index) => (
            <PropertyCard 
              key={index} 
              {...property} 
              onView={() => console.log(`Viewing ${property.title}`)} 
              onDelete={() => console.log(`Deleting ${property.title}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
