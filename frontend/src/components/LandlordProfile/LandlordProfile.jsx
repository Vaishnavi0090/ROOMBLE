import React, { useEffect, useState } from "react";
import "../../css/LandlordProfileStyles/LandlordProfile.css";
import PropertyCard from "../LandlordDashboard/PropertyCard.jsx";
const LandlordProfile = () => {
  const [respData, setRespData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        const response = await fetch(
          "http://127.0.0.1:3000/api/view_profiles/Self_profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authtoken: token, // ✅ Change from "Authorization" to "authtoken"
              accounttype: "landlord", // ✅ Also send account type separately
            },
            body: JSON.stringify({ ngj: "bkjmhkn" }),
          }
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
            <span>Properties Count</span> <span>:</span>
            <span>{respData.message}</span>
          </p>
        </div>
        <button className="landlord-profile-edit">Edit</button>
      </div>

      {/* Properties Section */}
      <div className="landlord-profile-properties">
        {respData.Properties.map(
          ({
            _id,
            city,
            town,
            address,
            area,
            bhk,
            description,
            amenities,
            price,
            available,
            Images,
            reviews,
          }) => (
            <PropertyCard
              img={Images[0]}
              price={price}
              title={"Prop Card"}
              locality={town}
              bhk={bhk}
            />
          )
        )}
      </div>
    </div>
  );
};

export default LandlordProfile;
