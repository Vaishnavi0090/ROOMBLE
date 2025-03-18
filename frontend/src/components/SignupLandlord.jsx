import React from "react";
import "../css/SignupLandlord.css";
import logo from '../../public/logo.png';

function SignupLandlord() {
  return (
    <div className="signup-landlord-container">
      {/* Left Section */}
      <div className="signup-landlord-left-section">
        <img
          src={logo}
          alt="Roomble Logo"
          className="signup-landlord-logo"
        />
      </div>

      {/* Right Section */}
      <div className="signup-landlord-right-section">
        <h1 className="signup-landlord-title">Signup as a Landlord</h1>

        {/* Form */}
        <form className="signup-landlord-form">
          <label>Your Good Name</label>
          <input type="text" placeholder="name" />

          <label>Your Email (please keep checking this email regularly)</label>
          <input type="email" placeholder="mail@abc.com" />

          <label>Password</label>
          <input type="password" placeholder="***************" />

          <label>Confirm Password</label>
          <input type="password" placeholder="***************" />

          {/* Sign Up Button */}
          <button type="submit" className="signup-landlord-button">
            Sign Up
          </button>
        </form>

        {/* Footer Text */}
        <p className="signup-landlord-footer-text">
          With Roomble, you’ll stumble on the perfect place to rumble!
        </p>
      </div>
    </div>
  );
}

export default SignupLandlord;
