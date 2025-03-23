import React, { useEffect, useState } from "react";
import "../../css/TenantProfilePageStyles/TenantEditPage.css";
import logo from "../../../public/sampleUser_img.png";
import { useContext } from "react";
import { Basecontext } from "../../context/base/Basecontext";
import { useNavigate } from "react-router-dom";
const TenantEditPage = () => {
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
      gender: state.user.gender === "Male",
      city: state.user.city,
      locality: state.user.locality,
      smoke: state.user.smoke,
      veg: state.user.veg,
      pets: state.user.pets,
      description: state.user.description,
      accounttype: state.user.type,
      remove: "",
    });
  }, [user]);
  const [formData, setFormData] = useState({
    name: state.user.name,
    email: state.user.email,
    gender: state.user.gender,
    city: state.user.city,
    locality: state.user.locality,
    smoke: state.user.smoke,
    veg: state.user.veg,
    pets: state.user.pets,
    description: state.user.description,
    accounttype: state.user.type,
    remove: "",
  });
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
            accounttype: "tenant",
          },
        }
      ); //67dd4b17afb6c9aafaa20f3c
      const data = await response.json();
      if (data.success) {
        console.log("Form submitted successfully");
        navigate("/tenant-profile-page");
        window.location.reload();
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="tenant-edit-container">
      {/* Header Section */}
      <div className="tenant-edit-header">
        <div className="tenant-edit-profile">
          <label htmlFor="tenant-edit-image-upload">
            <img
              src={state.user.Images || "https://via.placeholder.com/80"}
              alt="Profile"
              className="tenant-edit-profile-img"
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

          <div className="tenant-edit-info">
            <h2>{state.user.name}</h2>
            <p>{state.user.email}</p>
          </div>
        </div>
        <button className="tenant-edit-btn" onClick={handleSubmit}>
          Edit
        </button>
      </div>

      {/* Form Section */}
      <div className="tenant-edit-form">
        {/* Left Side */}
        <div className="tenant-edit-left">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />

          <label>Email Address</label>
          <input
            type="email"
            value={formData.email}
            name="email"
            onChange={handleInputChange}
          />

          <label>Gender</label>
          <select
            name="gender"
            // value={formData.gender === "Male" ? true : false}
            onChange={handleInputChange}
          >
            <option value={undefined} selected>
              gender
            </option>
            <option value={false}>Female</option>
            <option value={true}>Male</option>
          </select>
          <div className="tenant-edit-choices">
            <div className="tenant-edit-choices-smoke">
              <label>Alcohol/Smoking</label>
              <div className="edit-smoke-btn">
                <button
                  className={formData.smoke ? "active" : ""}
                  onClick={() => setFormData({ ...formData, smoke: true })}
                >
                  YES
                </button>
                <button
                  className={!formData.smoke ? "active" : ""}
                  onClick={() => setFormData({ ...formData, smoke: false })}
                >
                  NO
                </button>
              </div>
            </div>

            <div className="tenant-edit-choices-veg">
              <label>VEG/NON VEG</label>
              <div className="edit-veg-btn">
                <button
                  className={formData.veg ? "active" : ""}
                  onClick={() => setFormData({ ...formData, veg: true })}
                >
                  VEG
                </button>
                <button
                  className={!formData.veg ? "active" : ""}
                  onClick={() => setFormData({ ...formData, veg: false })}
                >
                  NON VEG
                </button>
              </div>
            </div>

            <div className="tenant-edit-choices-pets">
              <label>Domesticated Animal</label>
              <div className="edit-pets-btn">
                <button
                  className={formData.pets ? "active" : ""}
                  onClick={() => setFormData({ ...formData, pets: true })}
                >
                  YES
                </button>
                <button
                  className={!formData.pets ? "active" : ""}
                  onClick={() => setFormData({ ...formData, pets: false })}
                >
                  NO
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="tenant-edit-right">
          <label>City</label>

          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          >
            <option value="Mumbai">Mumbai</option>
          </select>

          <label>Locality</label>

          {/* <input
            type="text"
            name="locality"
            value={formData.locality}
            onChange={handleInputChange}
          /> */}
          <select
            name="locality"
            value={formData.locality}
            onChange={handleInputChange}>
            <option value="">Select Location</option>
            <option value="Andheri">Andheri</option>
            <option value="Bandra">Bandra</option>
            <option value="Juhu">Juhu</option>
            <option value="Malad">Malad</option>
            <option value="Kandivali">Kandivali</option>
            <option value="Borivali">Borivali</option>
            <option value="Dahisar">Dahisar</option>
            <option value="Mira Road">Mira Road</option>
            <option value="Thane">Thane</option>
            <option value="Goregaon">Goregaon</option>
          </select>

          {/* <span>Religion</span>

          <select
            name="religion"
            value={formData.religion}
            onChange={handleInputChange}
          >
            <option value="Christian">Christian</option>
            <option value="Hindu">Hindu</option>
            <option value="Muslim">Muslim</option>
            <option value="Other">Other</option>
          </select> */}

          <span>My Brief Intro</span>
          <textarea
            type="text"
            id="briefIntro"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TenantEditPage;
