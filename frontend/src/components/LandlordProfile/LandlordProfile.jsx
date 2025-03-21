import React, { useEffect, useState } from "react";
import "../css/LandlordProfile.css";
import "./PropertyCard.jsx";
const LandlordProfile = () => {
  const [respData, setRespData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:3000/api/view_profiles/Self_profile"
        );
        const data = await response.json();
        setRespData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!respData) {
    return <div className="landlord-profile-loading">Loading...</div>;
  }

  return (
    <div className="landlord-profile-container">
      {/* Profile Section */}
      <div className="landlord-profile-header">
        <img src={""} alt="Profile" className="landlord-profile-image" />
        <div className="landlord-profile-details">
          <p>
            <span>Full Name</span> <span>:</span>
            <span>{respData.name}</span>
          </p>
          <p>
            <span>Email Address</span> <span>:</span>
            <span>{respData.email}</span>
          </p>
          <p>
            <span>Gender</span> <span>:</span>
            <span>{respData.gender}</span>
          </p>
          <p>
            <span>Properties Count</span> <span>:</span>
            <span>{respData.propertiesCount}</span>
          </p>
        </div>
        <button className="landlord-profile-edit">Edit</button>
      </div>

      {/* Properties Section */}
      <div className="landlord-profile-properties">
        {respData.Properties.map((property) => (
          <PropertyCard
            img={property.image}
            price={property.price}
            title={property.name}
            locality={property.address}
            bhk={property.bhk}
          />
        ))}
      </div>
    </div>
  );
};

export default LandlordProfile;
