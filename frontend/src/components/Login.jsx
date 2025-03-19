import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";
import logo from "../../public/logo.png"; // Vite uses '/' for public assets

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLandlord, setIsLandlord] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Load saved email & password from localStorage when the component mounts
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedPassword = localStorage.getItem("rememberedPassword");
        const savedUserType = localStorage.getItem("rememberedUserType");

        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
            setIsLandlord(savedUserType === "landlord");
        }
    }, []);

    const handleToggle = () => {
        setIsLandlord(!isLandlord);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const userType = isLandlord ? "landlord" : "tenant"; 

        try {
            const response = await fetch("http://127.0.0.1:3000/api/"+userType+"/auth/"+userType+"_login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password}),
            });

            const data = await response.json();
            setLoading(false);

            if (data.success) {
                localStorage.setItem("token", data.token);

                if (rememberMe) {
                    localStorage.setItem("rememberedEmail", email);
                    localStorage.setItem("rememberedPassword", password);
                    localStorage.setItem("rememberedUserType", userType);
                } else {
                    localStorage.removeItem("rememberedEmail");
                    localStorage.removeItem("rememberedPassword");
                    localStorage.removeItem("rememberedUserType");
                }

                isLandlord? navigate("/landlord-dashboard") : navigate("/tenant-dashboard"); 
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
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <label htmlFor="rememberMe" className="remember-label">Remember Me</label>
                        </span>
                        <Link to="/otp-page" className="forgot-password">Forgot Password?</Link>
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
                    Not Registered Yet? <Link to={isLandlord ? "/signup-landlord" : "/signup-tenant"}>Create an account</Link>
                </p>
                <p className="footer-text">
                    With Roomble, you'll stumble on the perfect place to rumble!
                </p>
            </div>
        </div>
    );
};

export default Login;
