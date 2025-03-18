import React, { useEffect } from 'react'
import '../css/Navbar.css'
import { useContext } from 'react'
import { Basecontext } from '../context/base/Basecontext'
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const state = useContext(Basecontext)
  const {user, setUser, fetuser} = state
  fetuser()
  // useEffect(()=>{console.log(user)}, [user])


  return (
    <div className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="logo" className='logo-img'/>
      </div>
      <div className="menu">
        <ul>
          <li><Link to="/prop-display">Home</Link></li>
          <li><Link to="/add-property">Add Property</Link></li>
          <li><Link to="/messages">Messages</Link></li>
          <li><Link to="/find-property">Find Property</Link></li>
          <li><Link to="/find-flatmate">Find Flatmate</Link></li>
        </ul>
      </div>
      <div className="account-logo">
        {state.user.type=='none'?
        <>
        <button className='login-btn'><Link to="/login">Login</Link></button>
        <button className='signup-btn'><Link to="/signup-tenant">Sign Up</Link></button>
        </>:
        // <a href= " if user type is tenant then /tenant-profile-page else /landlord-profile-page" className='account-img'>
        <a href= {user.type=='tenant'?"/tenant-profile-page":"/landlord-profile-page"}>
          <img src="/user.png" alt="account" className='account-img'/>
        </a>
        // <img src="/user.png" alt="account" className='account-img'/>
        }
      </div>
    </div>
  )
}
