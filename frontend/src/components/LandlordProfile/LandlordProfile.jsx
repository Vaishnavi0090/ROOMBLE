import React, { useEffect, useState } from "react";
import "../../css/LandlordProfileStyles/LandlordProfile.css";
import PropertyCard from "../LandlordDashboard/PropertyCard.jsx";
import logo from "../../../public/property-img.png";
import pfp from "../../../public/sampleUser_Img.png";
import { useNavigate } from "react-router-dom";
const LandlordProfile = () => {
  const [respData, setRespData] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate("/landlord-edit-page");
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };
  // const handleDelete = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://127.0.0.1:3000/api/Deleting_routes/deleteInitiate",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           email: state.user.email,
  //           accounttype: "landlord",
  //         }),
  //       }
  //     );

  //     const data = await response.json();
  //     if (data.success) {
  //       localStorage.setItem("deleteToken", data.authtoken);
  //       navigate("/otp-delete-page", {
  //         state: { email: state.user.email, accountType: "landlord" },
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Could not initiate account deletion.");
  //   }
  // };
  const token = localStorage.getItem("authtoken");
  useEffect(() => {
    const fetchData = async () => {
      try {
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
  // const handleDeleteProp = async (Sendid) => {
  //   try {
  //     // console.log(Sendid);
  //     const response = await fetch(
  //       `http://127.0.0.1:3000/api/deleteproperty/deleteProperty/${Sendid}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           authtoken: token, // Replace with actual data
  //         },
  //       }
  //     );

  //     const respData = await response.json();

  //     if (respData.success) {
  //       console.log("Delete successful:", respData.message);
  //     } else {
  //       console.error("Delete failed:", respData.message);
  //     }
  //   } catch (error) {
  //     console.error("Error during delete request:", error);
  //   }
  // };
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

              <div className="landlord-profile-buttons">
                <button
                  className="landlord-profile-edit-button"
                  onClick={handleSubmit}
                >
                  Edit
                </button>
                <button
                  className="landlord-profile-logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                {/* <button
                  className="landlord-profile-delete-button"
                  onClick={handleDelete}
                >
                  Delete
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section (Still Inside the Same Container) */}
        <div className="landlord-profile-properties">
          {respData.Properties.map(({ _id, town, bhk, price, Images, available, city }) => (
            <PropertyCard
              key={_id}
              image={Images[0]}
              price={price}
              location={`${town}, ${city}`}
              bhk={bhk}
              id={_id}
              available={available}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandlordProfile;
