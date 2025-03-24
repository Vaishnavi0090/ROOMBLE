import React from "react";
import { useState, useRef } from "react";
import logo from "../../../public/sampleUser_img.png";
import "../../css/TenantProfilePageStyles/TenantProfilePage.css"; // Import the CSS specific to this component
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Basecontext } from "../../context/base/Basecontext";

export default function TenantProfilePage() {
  const navigate = useNavigate();

  const state = useContext(Basecontext);
  const { user, setUser, fetuser } = state;
  fetuser();

  const handleSubmit = () => {
    navigate("/tenant-edit-page");
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
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
  //           accounttype: "tenant",
  //         }),
  //       }
  //     );

  //     const data = await response.json();
  //     if (data.success) {
  //       localStorage.setItem("deleteToken", data.authtoken);
  //       navigate("/otp-delete-page", {
  //         state: { email: state.user.email, accountType: "tenant" },
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Could not initiate account deletion.");
  //   }
  // };
  return (
    <div className="tenant-profile-container">
      {/* Left Column */}
      <div className="tenant-profile-left-column">
        <img
          src={state.user.Images}
          alt="Profile"
          className="tenant-profile-photo"
        />
        <div className="tenant-bio-class">
          <p className="tenant-profile-bio">
            {(state.user.description === "This user hasn't setup a description yet") || 
              (state.user.description === "")
              ? "You have not set up a description yet"
              : state.user.description}
              </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="tenant-profile-right-column">
        <div className="tenant-profile-details">
          <div className="tenant-profile-name">
            <p>
              <span>Full Name </span>
              <span>:</span>
              <span>{state.user.name}</span>
            </p>
          </div>
          <div className="tenant-profile-mail">
            <p>
              <span>Email Address </span>
              <span>:</span> <span>{state.user.email}</span>
            </p>
          </div>
          <div className="tenant-profile-city">
            <p>
              <span>City</span>
              <span>:</span> <span>{state.user.city}</span>
            </p>
          </div>
          <div className="tenant-profile-locality">
            <p>
              <span>Locality </span>
              <span>:</span> <span>{state.user.locality}</span>
            </p>
          </div>
          <div className="tenant-profile-gender">
            <p>
              <span>Gender </span>
              <span>:</span>{" "}
              <span>{state.user.gender ? "Male" : "Female"}</span>
            </p>
          </div>
          <div className="tenant-profile-flatmate">
            <p>
              <span>Seeking Flatmate </span>
              <span>:</span>{" "}
              <span>
                {state.user.flatmate
                  ? "Yes"
                  : "No"}
              </span>
            </p>
          </div>
          <div className="tenant-profile-smoke">
            <p>
              <span>Alcohol/smoking </span> <span>:</span>{" "}
              <span>{state.user.smoke ? "Smokes" : "Doesn't Smoke"}</span>
            </p>
          </div>
          <div className="tenant-profile-veg">
            <p>
              <span>Veg/Non Veg </span>
              <span>:</span> <span>{state.user.veg ? "Veg" : "Non-Veg"}</span>
            </p>
          </div>
          <div className="tenant-profile-pets">
            <p>
              <span>Domesticated animals </span>
              <span>:</span>{" "}
              <span>{state.user.pets ? "Has Pets" : "No Pets"}</span>
            </p>
          </div>
        </div>

        <div className="tenant-profile-buttons">
          <button className="tenant-profile-edit-button" onClick={handleSubmit}>
            Edit
          </button>
          <button
            className="tenant-profile-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
          {/* <button
            className="tenant-profile-delete-button"
            onClick={handleDelete}
          >
            Delete
          </button> */}
        </div>
      </div>
    </div>
  );
}
