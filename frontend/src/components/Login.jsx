import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";
import logo from "/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("tenant"); // 'tenant' or 'landlord'
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedUserType = localStorage.getItem("rememberedUserType");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
      setUserType(savedUserType || "tenant");
    }
  }, []);

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        `http://127.0.0.1:3000/api/${userType}/auth/${userType}_login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        localStorage.setItem("authtoken", data.authtoken);
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
          localStorage.setItem("rememberedUserType", userType);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberedUserType");
        }

        navigate(userType === "landlord" ? "/landlord-dashboard" : "/tenant-dashboard");
        window.location.reload();
      } else {
        setError(data.message || "Invalid login credentials");
      }
    } catch (err) {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="login-main-container">
      {/* Left Section: Logo */}
      <div className="login-logo-container">
        <img src={logo} alt="Roomble Logo" />
      </div>

      {/* Right Section: Login Form */}
      <div className="login-login-box">
        <h2 className="login-login-title">Login to your Account</h2>
        <p className="login-subtext">See what is going on with your business</p>

        {/* Tenant / Landlord buttons */}
        <div className="login-user-type-buttons">
          <button
            className={`login-user-btn ${userType === "tenant" ? "selected" : ""}`}
            onClick={() => handleUserTypeChange("tenant")}
          >
            <img 
              src={userType === "landlord" ? "/key.png" : "/key_white.png"} 
              style={{ width: "50px", height: "50px" }} 
  
            />
            Tenant
          </button>
          <button
            className={`login-user-btn ${userType === "landlord" ? "selected" : ""}`}
            onClick={() => handleUserTypeChange("landlord")}
          >
            <img 
            src={userType === "landlord" ? "/white_house.png" : "/house.jpg"} 
            style={{ width: "50px", height: "50px" }} 

          />
            Landlord
          </button>
        </div>

        <form className="login-login-form" onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="login-email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="login-page-label">Password</label>
          <input
            type="password"
            id="login-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login-remember-forgot">
            <span className="login-remember-container">
              <input
                type="checkbox"
                id="login-rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe" className="login-remember-label">
                Remember Me
              </label>
            </span>
            <Link to="/forgot-password" className="login-forgot-password">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="login-error-text">{error}</p>}

          <button type="submit" className="login-login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-register-text">
          Not Registered Yet?{" "}
          <Link to={userType === "landlord" ? "/signup-landlord" : "/signup-tenant"}>
            Create an account
          </Link>
        </p>
        <p className="login-footer-text">
          With Roomble, you'll stumble on the perfect place to rumble!
        </p>
      </div>
    </div>
  );
};

export default Login;
