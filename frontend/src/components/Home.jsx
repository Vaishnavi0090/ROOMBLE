import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css"; // Import CSS for styling

export const Home = () => {
  return (
    <>
    <section className="home-first">
        <div className="home-first-intro">
            <h1>Welcome to Roomble!</h1>
            <p>
            Discover your perfect space with Roomble! Whether you're a tenant searching for a cozy home, a landlord managing properties, or someone looking for the ideal flatmate, Roomble makes it seamless and stress-free. Start your journey today!
            </p>
        </div>
    </section>
    <section className="home-second">
    <div className="home-second-features">
        <h2>Features</h2>
        <div className="home-second-features-list">
            <div className="home-second-features-item">
                <i className="fas fa-home"></i>
                <p>Find your dream home</p>
            </div>
            <div className="home-second-features-item">
                <i className="fas fa-user-friends"></i>
                <p>Connect with potential flatmates</p>
            </div>
            <div className="home-second-features-item">
                <i className="fas fa-building"></i>
                <p>Manage your properties</p>
            </div>
            <div className="home-second-features-item">
                <i className="fas fa-star"></i>
                <p>Read and Write Reviews</p>
            </div>
            <div className="home-second-features-item">
                <i className="fas fa-envelope"></i>
                <p>Send and Receive Messages</p>
            </div>
        </div>
    </div>
</section>
    <section className="home-third">
        <div className="home-third-cta">
            <h2>Ready to get started?</h2>
            <div className="home-third-buttons">
                <Link to="/signup-tenant" className="home-third-button">Sign Up as Tenant</Link>
                <Link to="/signup-landlord" className="home-third-button">Sign Up as Landlord</Link>
            </div>
        </div>
    </section>
    </>
  );
};