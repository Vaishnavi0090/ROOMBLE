import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/OTPPage/OTPPage.css";
import logo from "../../../public/logo.png";

export default function OTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, accountType } = location.state || {}; // Get email & account type from navigation state

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOTP = otp.join("");
    if (enteredOTP.length !== 6) {
      setMessage("Please enter a complete 6-digit OTP.");
      setSuccess(false);
      return;
    }

    try {
      const token = localStorage.getItem("deleteToken"); // Get stored delete token
      if (!token) {
        setMessage("No delete token found. Please try again.");
        setSuccess(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:3000/api/Deleting_routes/enterOTPtoDelete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authtoken": token, // ✅ Change from "Authorization" to "authtoken"
          "accounttype": accountType, // ✅ Also send account type separately
        },
        body: JSON.stringify({ Entered_OTP: enteredOTP, accounttype: accountType }),
      });

      const data = await response.json();
      setMessage(data.message);
      setSuccess(data.success);

      if (data.success) {
        alert("Account deleted successfully.");
        localStorage.removeItem("deleteToken"); // Clear delete token
        localStorage.removeItem("token");
        navigate("/login"); // Redirect to login
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
      setSuccess(false);
    }
  };

  return (
    <div className="otp-page-container">
      {/* Left section with image */}
      <div className="otp-page-image">
        <img src={logo} alt="OTP Illustration" />
      </div>

      {/* Right section with OTP form */}
      <div className="otp-page-form-container">
        <h2 className="otp-page-title">Verify OTP for Deletion</h2>
        <div className="otp-text-input">
          {message && (
            <p className={`otp-page-message ${success ? "otp-page-success" : "otp-page-error"}`}>
              {message}
            </p>
          )}
          <p className="otp-page-instruction">Enter the OTP sent to {email}</p>
          <form onSubmit={handleSubmit}>
            <div className="otp-page-input-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  maxLength={1}
                  className="otp-page-input"
                />
              ))}
            </div>
            <button type="submit" className="otp-page-submit-btn">
              Verify OTP
            </button>
          </form>
        </div>
        <footer className="otp-page-footer">
          With Roomble, you'll stumble on the perfect place to rumble.
        </footer>
      </div>
    </div>
  );
}
