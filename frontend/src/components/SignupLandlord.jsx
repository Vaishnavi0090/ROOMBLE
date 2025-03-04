import React from "react";
import "../css/SignupLandlord.css";
import logo from '../../public/logo.png'

function SignupLandlord() {
  return (
    <div className="container">
      {/* Left Section */}
      <div className="left-section">
        <img
          src=".jpg"
          alt="Roomble Logo"
          className="logo"
        />
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h1 className="signup-title">Signup as a Landlord</h1>

        {/* Form */}
        <form>
          <label>Your Good Name</label>
          <input type="text" placeholder="name" />

          <label>Your Email (please keep checking this email regularly)</label>
          <input type="email" placeholder="mail@abc.com" />

          <label>Password</label>
          <input type="password" placeholder="***************" />

          <label>Confirm Password</label>
          <input type="password" placeholder="***************" />

          {/* Sign Up Button */}
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        {/* Footer Text */}
        <p className="footer-text">
          With Roomble, you’ll stumble on the perfect place to rumble!
        </p>
      </div>
    </div>
  );
}

export default SignupLandlord;
