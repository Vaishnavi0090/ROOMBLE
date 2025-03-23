import React, { useEffect, useState } from "react";
import "../../css/LandlordProfileStyles/LandlordEditProfile.css";
import logo from "../../../public/sampleUser_img.png";
import { useContext } from "react";
import { Basecontext } from "../../context/base/Basecontext";
import { useNavigate } from "react-router-dom";
const LandlordEditProfile = () => {
  const navigate = useNavigate();
  const state = useContext(Basecontext);
  const { user, setUser, fetuser } = state;
  fetuser();
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("authtoken");
  useEffect(() => {
    setFormData({
      name: state.user.name,
      email: state.user.email,
      accounttype: state.user.type,
      remove: "",
    });
  }, [user]);
  const [formData, setFormData] = useState({
    name: state.user.name,
    email: state.user.email,
    accounttype: state.user.type,
    remove: "",
  });
  // console.log(state);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // NEED TO SEND DATA TO BACKEND FROM HERE
  const handleSubmit = async () => {
    const formDataCopy = new FormData(); // ✅ Create a FormData object

    // Append text fields to FormData
    Object.keys(formData).forEach((key) => {
      formDataCopy.append(key, formData[key]);
    });

    // Append the file (assuming 'file' is a valid File object)
    if (file) {
      formDataCopy.append("image", file); // ✅ Correct way to append a file
    }
    try {
      const response = await fetch(
        "http://127.0.0.1:3000/api/updates/updateProfile",
        {
          method: "PUT",
          body: formDataCopy,
          headers: {
            // "Content-Type": "application/json",
            authtoken: token, // Replace with actual data
            accounttype: "landlord",
          },
        }
      ); //67dd4b17afb6c9aafaa20f3c
      const data = await response.json();
      if (data.success) {
        console.log("Form submitted successfully");
        navigate("/landlord-profile-page");
        window.location.reload();
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="landlord-edit-container">
      {/* Header Section */}
      <div className="landlord-edit-header">
        <div className="landlord-edit-profile">
          <label htmlFor="landlord-edit-image-upload">
            <img
              src={state.user.Images || "https://via.placeholder.com/80"}
              alt="Profile"
              className="landlord-edit-profile-img"
            />
          </label>
          <input
            type="file"
            id="image_input"
            accept="image/png, image/gif, image/jpeg, image/jpg"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />

          <div className="landlord-edit-info">
            <h2>{state.user.name}</h2>
            <p>{state.user.email}</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="landlord-edit-form">
        {/* Left Side */}
        <div className="name">
          <span>
            Full Name <br />
            <br />
            Enter new name
            <br />
            <br />
          </span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="email-addr">
          <span>
            Email Address <br />
            <br />
            Enter new email address
            <br />
            <br />
          </span>
          <input
            type="email"
            value={formData.email}
            name="email"
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="edtbttn">
        <button className="landlord-edit-btn" onClick={handleSubmit}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default LandlordEditProfile;
