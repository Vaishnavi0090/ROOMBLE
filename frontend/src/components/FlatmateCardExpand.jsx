import React from 'react';
import "../css/FlatmateCardExpand.css";
import { BsBookmark, BsBookmarkFill, BsChatDots } from 'react-icons/bs';
import { useState } from 'react';

const FlatmateCardExpand = () => {
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleBookmarkClick = () => {
        setIsBookmarked(!isBookmarked);
    };

    const profileData = {
        Name: "Bill Gates",
        Email: "BillGates@gmail.com",
        City: "Bangalore",
        Locality: "Koramangala",
        Gender: "Male",
        Religion: "Christian",
        "Do you drink or smoke?" : "YES",
        "Food Preferences": "NON VEG",
        "Do you have a pet?": "YES",
        Bio: "Hi, I am Bill Gates, a software engineer working at Microsoft in Bangalore. I am a responsible and tidy tenant who values a clean and peaceful living space. I am looking for an apartment that suits my lifestyle.",
        profileImage: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Bill_Gates_2018.jpg"
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

                    <button className="fce-message-btn">
                        <BsChatDots className="fce-message-icon" /> Message
                    </button>
                </div>
            </div>
        </div>
        </section>
    );
};

export default FlatmateCardExpand;
