import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import "../../css/ForgotPassword/SetNewPassword.css";
import logo from "../../../public/logo.png";

const SetNewPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const accounttype = searchParams.get("accounttype");

    useEffect(() => {
        if (!token || !email || !accounttype) {
            setError("Invalid or missing authentication details.");
            navigate("/forgot-password");
        }
    }, [token, email, accounttype, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true)
            console.log("Submitting request...");
            console.log("Token:", token);
            console.log("Email:", email);
            console.log("Account Type:", accounttype);

            const response = await fetch(`http://127.0.0.1:3000/api/forgotPassword/ForgotPassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authtoken": token,           // Send token
                    "accounttype": accounttype    // Send account type
                },
                body: JSON.stringify({
                    email,
                    newPassword,
                    accounttype
                }),
            });

            console.log("Response Status:", response.status);

            if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            setError(`Error: ${response.status} - ${errorText}`);
            return;
            }

            const data = await response.json();
            console.log("Server Response:", data);

            if (data.success) {
                alert("Password reset successful!");
                navigate("/login");
            } else {
                setError(data.message || "Failed to reset password.");
            }
        } catch (error) {
            console.error("Network/Parsing Error:", error);
            setError(`Network error: ${error.message}`);
          }
        };
    
    return (
        <div className="main-container">
            {/* Left Section: Logo */}
            <div className="logo-container">
                <img src={logo} alt="Roomble Logo" />
            </div>

            {/* Right Section: Reset Password Form */}
            <div className="login-box">
                <h2 className="login-title">Reset Password</h2>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="new-password">Enter new password</label>
                    <input
                        type="password"
                        id="new-password"
                        placeholder="Enter new password"
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <input
                        type="password"
                        id="new-password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Redirecting..." : "Submit"}
                    </button>
                </form>

                {/* Navigation Links */}
                <p className="register-text">
                    Remember your password? <Link to="/login">Login</Link>
                </p>
                <p className="register-text">
                    Not Registered Yet? <Link to="/signup-tenant">Sign up</Link>
                </p>

                <p className="footer-text">
                    With Roomble, you'll stumble on the perfect place to rumble!
                </p>
            </div>
        </div>
    );
};

export default SetNewPassword;