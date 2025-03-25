import React from "react";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faLeaf, faDrumstickBite, faWineGlassAlt, faBan, faMars, faVenus, faTimes, faCheck} from "@fortawesome/free-solid-svg-icons"; // Import icons
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
            {state.user.description ===
              "This user hasn't setup a description yet" ||
            state.user.description === ""
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
              <span>
                {state.user.gender ? (
                  <>
                    Male{" "}
                    <FontAwesomeIcon
                      icon={faMars}
                      style={{ color: "#7D141D", marginLeft: "5px" }}
                    />
                  </>
                ) : (
                  <>
                    Female{" "}
                    <FontAwesomeIcon
                      icon={faVenus}
                      style={{ color: "#7D141D", marginLeft: "5px" }}
                    />
                  </>
                )}
              </span>
            </p>
          </div>
          <div className="tenant-profile-flatmate">
          <p>
              <span>Seeking Flatmate </span>
              <span>:</span>{" "}
              <span>
                {state.user.flatmate ? (
                  <>
                    Yes{" "}
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ color: "#7D141D", marginLeft: "5px" }}
                    />
                  </>
                ) : (
                  <>
                    No{" "}
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ color: "#7D141D", marginLeft: "5px" }}
                    />
                  </>
                )}
              </span>
            </p>
          </div>
          <div className="tenant-profile-smoke">
          <p>
              <span>Alcohol/Smoking </span>
              <span>:</span>{" "}
              <span>
                {state.user.smoke ? (
                  <>
                    Smokes/Drinks{" "}
                    <FontAwesomeIcon
                      icon={faWineGlassAlt}
                      style={{ color: "#7D141D", marginLeft: "5px" }}
                    />
                  </>
                ) : (
                  <>
                    Doesn't Smoke/Drink{" "}
                    <FontAwesomeIcon
                      icon={faBan}
                      style={{ color: "#7D141D", marginLeft: "5px" }}
                    />
                  </>
                )}
              </span>
            </p>
          </div>
          <div className="tenant-profile-veg">
          <p>
              <span>Veg/Non Veg </span>
              <span>:</span>{" "}
              <span>
                {state.user.veg ? (
                  <>
                    Veg{" "}
                    <FontAwesomeIcon
                      icon={faLeaf}
                      style={{ color: "#7D141D", marginLeft: "5px" }}
                    />
                  </>
                ) : (
                  <>
                    Non-Veg{" "}
                    <FontAwesomeIcon
                      icon={faDrumstickBite}
                      style={{ color: "#7D141D", marginLeft: "5px" }}
                    />
                  </>
                )}
              </span>
            </p>
          </div>
          <div className="tenant-profile-pets">
          <p>
    <span>Has Pets </span>
    <span>:</span>{" "}
    <span>
      {state.user.pets ? (
        <>
          Yes{" "}
          <FontAwesomeIcon
            icon={faPaw}
            style={{ color: "#7D141D", marginLeft: "5px" }}
          />
        </>
      ) : (
        <>
          No{" "}
          <FontAwesomeIcon
            icon={faBan}
            style={{ color: "#7D141D", marginLeft: "5px" }}
          />
        </>
      )}
    </span>
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
