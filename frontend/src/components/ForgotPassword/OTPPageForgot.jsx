import React from "react";
import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/ForgotPassword/OTPPageForgot.css"; // Import the CSS specific to this component
import logo from "../../../public/logo.png";
import { Basecontext } from '../../context/base/Basecontext'

export default function OTPPageForgot() {
  const navigate = useNavigate();

  const state = useContext(Basecontext)
  const {user, setUser, fetuser} = state
  fetuser()

  const respURL = `http://127.0.0.1:3000/api/forgotPassword/enterOTP/`;
  //   console.log(respURL);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const inputRefs = useRef([]);
  const [authtoken, setAuthtoken] = useState(null);
 
  useEffect(() => {
    const token = localStorage.getItem("authtoken");
    
    console.log("Retrieved Token:", token);

    if (token) {
        setAuthtoken(token);
        setAccounttype(type);
    } else {
        console.error("Token missing.");
        navigate("/forgot-password");
    }
  }, [navigate]);

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
      console.log(enteredOTP);
      const response = await fetch(respURL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "authtoken": token, "accounttype": "tenant" },
        body: JSON.stringify({ Entered_OTP: enteredOTP }),
      });
      const data = await response.json();
      setMessage(data.message);
      setSuccess(data.success);
      if (data.success) {
        navigate("/login");
      }
    } catch (error) {
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
        <h2 className="otp-page-title">Verify OTP</h2>
        <div className="otp-text-input">
          <div>
            {message && (
              <p
                className={`otp-page-message ${
                  success ? "otp-page-success" : "otp-page-error"
                }`}
              >
                {message}
              </p>
            )}
          </div>
          <p className="otp-page-instruction">Enter OTP</p>
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
