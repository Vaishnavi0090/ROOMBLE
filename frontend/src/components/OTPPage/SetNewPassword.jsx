import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../css/OTPPage/SetNewPassword.css";
import logo from "../../../public/logo.png";

const SetNewPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oldPassword, setOldPassword] = useState(""); // Fetched from backend
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Simulating email being passed from the previous page
    const email = localStorage.getItem("resetEmail");

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
            return;
        }

        // Fetch the old password from the backend using the email
        const fetchOldPassword = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:3000/api/auth/get_old_password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();
                if (data.success) {
                    setOldPassword(data.oldPassword);
                } else {
                    setError("Failed to retrieve old password.");
                }
            } catch (error) {
                setError("Network error. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchOldPassword();
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword === oldPassword) {
            setError("New password cannot be the same as the old password.");
            return;
        }

        // Simulate a password reset request
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/auth/reset_password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    newPassword,
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                alert("Password reset successful!");
                navigate("/");
            } else {
                setError(data.message || "Failed to reset password.");
            }
        } catch (error) {
            setError("Network error. Please try again.");
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