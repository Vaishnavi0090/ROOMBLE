import React, { useEffect, useContext } from 'react';
import '../css/Navbar.css';
import { Basecontext } from '../context/base/Basecontext';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { socket } from '../socket';
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

export const Navbar = () => {
  const state = useContext(Basecontext);
  const { user, setUser, fetuser } = state;

  useEffect(() => {
    // Fetch the user data on component mount
    fetuser();
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    // Handle socket connection when user is updated
    function handleConnection() {
      if (user && user._id) { // Ensure user and user._id are defined
        socket.emit("user_connected", user._id);
      }
    }

    if (user && user._id) {
      handleConnection();
    }

    return () => {
      socket.off("connect", handleConnection); // Clean up the event listener
    };
  }, [user]);


  return (
    <div className="navbar">
      
      <div className="logo">
        <img src="/logo_nav.png" alt="logo" className='logo-img' />
      </div>
      <div className="menu">
        {user.type === 'none' ? (
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/signup-tenant">Sign Up tenant</Link></li>
            <li><Link to="/signup-landlord">Sign Up landlord</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        ) : user.type === 'tenant' ? (
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/tenant-dashboard">Dashboard</Link></li>
            <li><Link to="/messages">Messages</Link></li>
            <li><Link to="/find-property">Find Property</Link></li>
            <li><Link to="/find-flatmate">Find Flatmate</Link></li>
          </ul>
        ) : (
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/landlord-dashboard">Dashboard</Link></li>
            <li><Link to="/add-property">Add Property</Link></li>
            <li><Link to="/messages">Messages</Link></li>
          </ul>
        )}
      </div>
      <div className="account-logo">
        {user.type === 'none' ? (
          <>
            {/* <button className='login-btn'><Link to="/login">Login</Link></button>
            <button className='signup-btn'><Link to="/signup-tenant">Sign Up</Link></button> */}
          </>
        ) : (
          <Link to={user.type === 'tenant' ? "/tenant-profile-page" : "/landlord-profile-page"}>
            <img src={state.user.Images}alt="account" className='account-img' />
          </Link>
        )}
      </div>
    </div>
  );
};
