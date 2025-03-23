import React, { useEffect, useState, useContext } from "react";
import PropertyCard from "./PropertyCard";
import "../../css/LandlordDashboard.css";

const HomePage = () => {
  const [Properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem("authtoken");
      try {
        const response = await fetch(`http://127.0.0.1:3000/api/view_profiles/Self_profile`,{
          method : "POST",
          headers: {
            "Content-Type" : "application/json",
            authtoken: token,
            accounttype: `landlord`
          },
        });

        const data = await response.json();
        if(!data.success) {
          throw new Error(data.message);
        }

        setProperties(data.Properties);
        console.log(data.Properties);

      } catch (error) {
        setError(error);
        console.log(`Error from Landlord Dashboard in frontend`);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const properties = [];

  for(let item of Properties){
    let newth = {};
    newth.title = "Flat";
    newth.image = item.Images[0];
    newth.price = item.price;
    newth.bhk = item.bhk;
    newth.location = item.town;
    newth.id = item._id;
    properties.push(newth);
  }

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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
