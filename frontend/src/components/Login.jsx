import React, { useState } from "react";
import "./Login.css";
import logo from "/roomble_logo.jpg"; // Vite uses '/' for public assets

const Login = () => {
    const [isLandlord, setIsLandlord] = useState(false);

    const handleToggle = () => {
        setIsLandlord(!isLandlord);
    };

    return (
        <div className="main-container">
            {/* Left Section: Logo */}
            <div className="logo-container">
                <img src={logo} alt="Roomble Logo" />
            </div>

            {/* Right Section: Login Form */}
            <div className="login-container">
                <div className="login-box">
                    <h2>Login to your Account</h2>
                    <p className="subtext">See what is going on with your business</p>

                    <form>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="mail@abc.com" required />

                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="*****************" required />

                        <div className="remember-forgot">
                            <span className="remember-container">
                                <label htmlFor="rememberMe" className="remember-label">Remember Me</label>
                                <input type="checkbox" id="rememberMe" />
                            </span>
                            <a href="#" className="forgot-password">Forgot Password?</a>
                        </div>

                        <button type="submit" className="login-button">Login</button>
                    </form>

                    {/* Toggle Switch */}
                    <div className="toggle-container">
                    <div className={`toggle-switch ${isLandlord ? "landlord-selected" : ""}`} onClick={handleToggle}>
                        <span className="toggle-text tenant">Tenant</span>
                        <span className="toggle-slider"></span>
                        <span className="toggle-text landlord">Landlord</span>
                    </div>
                    </div>

                    <p className="register-text">
                        Not Registered Yet? <a href="#">Create an account</a>
                    </p>
                    <p className="footer-text">
                        With Roomble, you'll stumble on the perfect place to rumble!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
