import React from 'react';
import "../css/FlatmateCardExpand.css";
import { BsBookmark, BsBookmarkFill, BsChatDots } from 'react-icons/bs';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Basecontext } from '../context/base/Basecontext';
import logo from "../../public/sampleUser_img.png";

const FlatmateCardExpand = () => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleBookmarkClick = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleMessageClick = () => {
        navigate('/messages'); // Navigate to the desired URL
    };

    const state = useContext(Basecontext);
    const { user, setUser, fetuser } = state;
    fetuser();

    const profileData = {
        Name: state.user.name,
        Email: state.user.email,
        City: state.user.city,
        Locality: state.user.locality,
        Gender: state.user.gender ? "Male" : "Female",
        "Do you drink or smoke?": state.user.smoke ? "Yes" : "No",
        "Food Preferences": state.user.veg ? "Vegetarian" : "Non-Vegetarian",
        "Do you have a pet?": state.user.pets ? "Yes" : "No",
        Bio: state.user.description,
        profileImage: state.user.Images,
    };

    return (
        <section className="fce-container">
            {/* Left Side: Profile Information */}
            <div className="fce-profile-info">
                <h2>Profile Information</h2>
                <ul>
                    {Object.entries(profileData).map(([key, value]) => (
                        key !== 'Bio' && key !== 'profileImage' && (
                            <li key={key}>
                                <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}
                            </li>
                        )
                    ))}
                </ul>
            </div>

            {/* Right Side: Profile Description */}
            <div className="fce-right-side">
                <div className="fce-profile-description">
                    <div className="fce-profile-header">
                        <div className="fce-profile-text">
                            <h3>{profileData.Name}</h3>
                            <p>{profileData.Gender}</p>
                        </div>
                        <img className="fce-profile-img" src={profileData.profileImage} alt={`${profileData.name} Profile`} />
                    </div>
                    <p>{profileData.Bio}</p>

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
