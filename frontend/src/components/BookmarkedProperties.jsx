import React from "react";
import PropertyCard from "../components/LandlordDashboard/PropertyCard.jsx";
import samplePropertyImg from "../../public/1111111.jpg"; // Sample image
import "../css/BookmarkedProperties.css";

const BookmarkedProperties = () => {
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
  ];

  return (
    <div className="bookmarked-properties">
      <h1 className="properties-title">Your Bookmarked Properties</h1>
      <div className="bookmarked-properties-grid">
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
  );
};

export default BookmarkedProperties;
