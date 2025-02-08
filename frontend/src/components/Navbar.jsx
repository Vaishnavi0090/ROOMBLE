import React from 'react'
import '../css/Navbar.css'
import { useContext } from 'react'
import { Basecontext } from '../context/base/Basecontext'
import Button from 'react-bootstrap/Button';

export const Navbar = () => {
  const state = useContext(Basecontext)
  // console.log(state)

  return (
    <div className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="logo" className='logo-img'/>
      </div>
      <div className="menu">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/add-property">Add Property</a></li>
          <li><a href="/messages">Messages</a></li>
        </ul>
      </div>
      <div className="account-logo">
        {state.user.type=='none'?
        <>
        <button className='login-btn'><a href="/login">Login</a></button>
        <button className='signup-btn'><a href="/signup">Sign Up</a></button>
        </>:
        <img src="/user.png" alt="account" className='account-img'/>
        }
      </div>
    </div>
  )
}
