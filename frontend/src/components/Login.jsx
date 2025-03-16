import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import logo from "../../public/logo.png"; // Vite uses '/' for public assets

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLandlord, setIsLandlord] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsLandlord(!isLandlord);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const userType = isLandlord ? "Landlord" : "Tenant"; 
        
        try {
            const response = await fetch("http://127.0.0.1:3000/api/"+userType+"/auth/"+userType+"_login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            setLoading(false);

            if (data.success) {
                localStorage.setItem("token", data.token);
                navigate("/messages");
            } else {
                setError(data.message || "Invalid login credentials");
            }
        } catch (err) {
            setLoading(false);
            setError("Network error. Please try again.");
        }
    };

    return (
        <div className="main-container">
            {/* Left Section: Logo */}
            <div className="logo-container">
                <img src={logo} alt="Roomble Logo" />
            </div>

            {/* Right Section: Login Form */}
            <div className="login-box">
                <h2 className="login-title">Login to your Account</h2>
                <p className="subtext">See what is going on with your business</p>

                <form className="login-form" onSubmit={handleLogin}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="mail@abc.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="*****************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="remember-forgot">
                        <span className="remember-container">
                            <label htmlFor="rememberMe" className="remember-label">Remember Me</label>
                            <input type="checkbox" id="rememberMe" />
                        </span>
                        <a href="#" className="forgot-password">Forgot Password?</a>
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
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
                    Not Registered Yet? <a href="/signup">Create an account</a>
                </p>
                <p className="footer-text">
                    With Roomble, you'll stumble on the perfect place to rumble!
                </p>
            </div>
        </div>
    );
};

export default Login;
