import React, { useEffect } from "react";
import { useState, useRef } from "react";
import logo from "../../public/sampleUser_img.png";
import "../css/TenantProfilePageStyles/TenantProfilePage.css"; // Import the CSS specific to this component
import { useNavigate, useParams } from "react-router-dom";

export default function OtherTenantProfile() {
    const params = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        "name":"Loading...",
        "email":"Loading...",
        "city":"Loading...",
        "locality":"Loading...",
        "description": "Loading...",
    });
    useEffect(() => {
        const id = params.id;
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/Tenant/auth/getuser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: id })
                });
                const data = await response.json();
                if (data.success) {
                    setUser(data.tenant);
                    console.log(data.tenant.name);
                } else {
                    console.log("Failed to fetch user");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, []);

    const messageClick = async ()=>{
        console.log(params.id)
        const response = await fetch('http://localhost:3000/messages/createConversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authtoken': localStorage.getItem('authtoken')
            },
            body: JSON.stringify({ user2: params.id })
        });
        const data = await response.json();
        if (data.success) {
            navigate('/messages/' + data.conversation_id);
        } else {
            console.log("Failed to create conversation");
        }

    }

    const reviewClick = async ()=>{
            
    }
  return (
    <div className="tenant-profile-container">
      {/* Left Column */}
      <div className="tenant-profile-left-column">
        <img src={logo} alt="Profile" className="tenant-profile-photo" />
        <div className="tenant-bio-class">
          <p className="tenant-profile-bio">
            {user.description}
          </p>
        </div>
        
      </div>
    
      {/* Right Column */}
      <div className="tenant-profile-right-column">
        <div className="tenant-profile-details">
          <div className="tenant-profile-name">
            <p>
              <span>Full Name </span>
              <span>:</span>
              <span>{user.name}</span>
            </p>
          </div>
          <div className="tenant-profile-mail">
            <p>
              <span>Email Address </span>
              <span>:</span> <span>{user.email}</span>
            </p>
          </div>
          <div className="tenant-profile-city">
            <p>
              <span>City</span>
              <span>:</span> <span>{user.city}</span>
            </p>
          </div>
          <div className="tenant-profile-locality">
            <p>
              <span>Locality </span>
              <span>:</span> <span>{user.locality}</span>
            </p>
          </div>
          <div className="tenant-profile-gender">
            <p>
              <span>Gender </span>
              <span>:</span> <span>{user.gender ?"Male":"Female"}</span>
            </p>
          </div>
          <div className="tenant-profile-smoke">
            <p>
              <span>Alcohol/smoking </span> <span>:</span> <span>{user.smoke ? "Smokes":"Doesn't Smoke"}</span>
            </p>
          </div>
          <div className="tenant-profile-veg">
            <p>
              <span>Veg/Non Veg </span>
              <span>:</span> <span>{user.veg ? "Veg":"Non-Veg"}</span>
            </p>
          </div>
          <div className="tenant-profile-pets">
            <p>
              <span>Domesticated animals </span>
              <span>:</span> <span>{user.pets? "Has Pets":"No Pets"}</span>
            </p>
          </div>
        </div>
        
        <div className="tenant-profile-buttons">
          <button className="tenant-profile-edit-button" onClick={messageClick}>
            Message
          </button>
          <button className="tenant-profile-logout-button" onClick={reviewClick}>
            Review
          </button>
        </div>
        </div>
      </div>
    
  );
}
