import React, { useState } from "react";
import "../../css/TenantProfilePageStyles/TenantEditPage.css";
import logo from "../../../public/sampleUser_img.png";

const TenantEditPage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "Alexa Rawles",
    email: "alexarawles@gmail.com",
    gender: "Female",
    city: "Bangalore",
    locality: "Koramangala, Bangalore, Karnataka - 560034",
    religion: "Christian",
    alcoholSmoking: "NO",
    foodPreference: "VEG",
    pets: "NO",
    briefIntro:
      "HI, I am Alexa Rawles, a software engineer working in Microsoft in Bangalore. I am a responsible and tidy tenant who values a clean and peaceful living space. I am looking for an apartment that suits my lifestyle.",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };
  // NEED TO SEND DATA TO BACKEND FROM HERE
  const handleSubmit = () => {
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="tenant-edit-container">
      {/* Header Section */}
      <div className="tenant-edit-header">
        <div className="tenant-edit-profile">
          <label htmlFor="tenant-edit-image-upload">
            <img
              src={logo || "https://via.placeholder.com/80"}
              alt="Profile"
              className="tenant-edit-profile-img"
            />
          </label>
          <input
            type="file"
            id="tenant-edit-image-upload"
            accept="image/*"
            onChange={handleImageUpload}
          />

          <div className="tenant-edit-info">
            <h2>Alexa Rawles</h2>
            <p>alexarawles@gmail.com</p>
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
            name="fullName"
            value={formData.fullName}
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
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
          <div className="tenant-edit-choices">
            <div className="tenant-edit-choices-smoke">
              <label>Alcohol/Smoking</label>
              <div className="edit-smoke-btn">
                <button
                  className={formData.alcoholSmoking === "YES" ? "active" : ""}
                  onClick={() =>
                    setFormData({ ...formData, alcoholSmoking: "YES" })
                  }
                >
                  YES
                </button>
                <button
                  className={formData.alcoholSmoking === "NO" ? "active" : ""}
                  onClick={() =>
                    setFormData({ ...formData, alcoholSmoking: "NO" })
                  }
                >
                  NO
                </button>
              </div>
            </div>

            <div className="tenant-edit-choices-veg">
              <label>VEG/NON VEG</label>
              <div className="edit-veg-btn">
                <button
                  className={formData.foodPreference === "VEG" ? "active" : ""}
                  onClick={() =>
                    setFormData({ ...formData, foodPreference: "VEG" })
                  }
                >
                  VEG
                </button>
                <button
                  className={
                    formData.foodPreference === "NON VEG" ? "active" : ""
                  }
                  onClick={() =>
                    setFormData({ ...formData, foodPreference: "NON VEG" })
                  }
                >
                  NON VEG
                </button>
              </div>
            </div>

            <div className="tenant-edit-choices-pets">
              <label>Domesticated Animal</label>
              <div className="edit-pets-btn">
                <button
                  className={formData.pets === "YES" ? "active" : ""}
                  onClick={() => setFormData({ ...formData, pets: "YES" })}
                >
                  YES
                </button>
                <button
                  className={formData.pets === "NO" ? "active" : ""}
                  onClick={() => setFormData({ ...formData, pets: "NO" })}
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
            <option value="Bangalore">Bangalore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>

          <label>Locality</label>

          <input
            type="text"
            name="locality"
            value={formData.locality}
            onChange={handleInputChange}
          />

          <span>Religion</span>

          <select
            name="religion"
            value={formData.religion}
            onChange={handleInputChange}
          >
            <option value="Christian">Christian</option>
            <option value="Hindu">Hindu</option>
            <option value="Muslim">Muslim</option>
            <option value="Other">Other</option>
          </select>

          <span>My Brief Intro</span>
          <textarea
            type="text"
            id="briefIntro"
            name="briefIntro"
            value={formData.briefIntro}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TenantEditPage;
