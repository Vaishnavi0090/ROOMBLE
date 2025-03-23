import React, { useEffect, useState } from "react";
import "../css/LandlordProfileStyles/LandlordProfile.css";
import PropertyCard from "./LandlordDashboard/PropertyCard.jsx";
import { useNavigate, useParams } from "react-router-dom";

const OtherLandlord = () => {
  const [respData, setRespData] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  const handleView = () => {
    navigate("/prop-display ");
  };
  const token = localStorage.getItem("authtoken");
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(token);
        const response = await fetch(
          "http://127.0.0.1:3000/api/view_profiles/other_users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ requested_id: params.id, accounttype: "landlord" }),
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

  console.log(respData.Images);
  return (
    <div className="landlord-profile-container">
      {/* Combined Profile & Properties Section */}
      <div className="landlord-profile-content">
        <div className="landlord-profile-header">
          <img
            src={respData.Images}
            alt="Profile"
            className="landlord-profile-image"
          />
          <div className="landlord-profile-details">
            <div className="landlord-profile-item">
              <div className="landlord-profile-name">
                <p>
                  <span className="label">Full Name</span>{" "}
                  <span className="separator">:</span>
                  <span className="value">{respData.name}</span>
                </p>
              </div>
              <div className="landlord-profile-email">
                <p>
                  <span className="label">Email Address</span>{" "}
                  <span className="separator">:</span>
                  <span className="value">{respData.email}</span>
                </p>
              </div>
              <div className="landlord-profile-propCount">
                <p>
                  <span className="label">Properties Count</span>{" "}
                  <span className="separator">:</span>
                  <span className="value">{respData.message}</span>
                </p>
              </div>

              <div className="landlord-profile-edit-button">
                <button className="landlord-profile-edit">Message</button>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section (Still Inside the Same Container) */}
        <div className="landlord-profile-properties">
          {respData.Properties.map(({ _id, town, bhk, price, Images }) => (
            <PropertyCard
              key={_id}
              image={Images[0]}
              price={price}
              title="Prop Card"
              location={town}
              bhk={bhk}
              id={_id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OtherLandlord;
