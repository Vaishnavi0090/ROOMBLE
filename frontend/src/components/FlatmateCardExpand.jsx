import React from 'react';
import "../css/FlatmateCardExpand.css";
import { BsBookmark, BsBookmarkFill, BsChatDots } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FlatmateCardExpand = () => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const navigate = useNavigate();

    const params = useParams();
    const [user, setUser] = useState({
        name: "Loading...",
        city: "Loading...",
        locality: "Loading...",
        description: "Loading...",
        gender: null,
        smoke: null,
        veg: null, 
        pets: null,
        Images: "http://127.0.0.1:3000/Pictures/Default.png", 
    });

    useEffect(() => {
        const id = params.id;
        const token = localStorage.getItem("authtoken");
        console.log("Token: ", token);

        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/view_profiles/other_users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authtoken': token,
                        'accounttype': "tenant"
                    },
                    body: JSON.stringify({ requested_id: id, accounttype: "tenant"})
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(`Error: ${response.status} - ${response.statusText}`, errorData);
                    return; 
                }

                const data = await response.json();
                console.log("Fetched Data:", data);

                if (data.success) {
                    setUser(data);
                    console.log(data);
                } else {
                    console.log("Failed to fetch user");
                }
            } catch (err) {
                    console.error("Error fetching user:", err);
                }
        };
    
        fetchUser();
    }, [params.id]);

    const handleBookmarkClick = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleMessageClick = () => {
        navigate('/chat/' + params.id);
    };

    if (!user || Object.keys(user).length === 0) {
        return <p>No user data found.</p>;
    }

    return (
        <section className="fce-container">
            {/* Left Side: Profile Information */}
            <div className="fce-profile-info">
                <h2>Profile Information</h2>
                <ul>
                    <li><strong>Name:</strong> {user.name}</li>
                    <li><strong>City:</strong> {user.city}</li>
                    <li><strong>Locality:</strong> {user.locality}</li>
                    <li><strong>Gender:</strong> {user.gender ? "Male" : "Female"}</li>
                    <li><strong>Do you drink or smoke?</strong> {user.smoke ? "Yes" : "No"}</li>
                    <li><strong>Food Preferences:</strong> {user.veg ? "Vegetarian" : "Non-Vegetarian"}</li>
                    <li><strong>Do you have a pet?</strong> {user.pets ? "Yes" : "No"}</li>
                </ul>
            </div>

            {/* Right Side: Profile Description */}
            <div className="fce-right-side">
                <div className="fce-profile-description">
                    <div className="fce-profile-header">
                        <div className="fce-profile-text">
                            <h3>{user.name}</h3>
                            <p>{user.gender ? "Male" : "Female"}</p>
                        </div>
                        <img className="fce-profile-img" src={user.Images} alt={`${user.name} Profile`} />
                    </div>
                    <p>{user.description}</p>

                    <div className="fce-action-buttons">
                        <div className="fce-bookmark-section" onClick={handleBookmarkClick}>
                            {isBookmarked ? (
                                <BsBookmarkFill className="fce-bookmark-icon filled" />
                            ) : (
                                <BsBookmark className="fce-bookmark-icon" />
                            )}
                        </div>

                        <button className="fce-message-btn" onClick={handleMessageClick}>
                            <BsChatDots className="fce-message-icon" /> Message
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlatmateCardExpand;
