import React, { useEffect, useState } from "react";
import "../../css/PropertyCard.css";
import "../../css/PropertyCardTenant.css";
import { useNavigate } from "react-router-dom";
import useDidMountEffect from "../../useDidMountEffect";

const PropertyCardTenant = ({ image, price, title, location, bhk, onView, onBookMark, id }) => {
  const [isPopping, setIsPopping] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();

  const triggerPop = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 300); // Duration should match CSS animation
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleView = () => {
    navigate("/property/" + id);
  };

  useEffect(()=>{
    const fetchbookmarkstatus = async()=>{
        const response = await fetch('http://localhost:3000/api/BookMarking_Routes/check_bookmark',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authtoken': localStorage.getItem('authtoken')
            },
            body: JSON.stringify({ id: id, thing: "property" })
        });
        const data = await response.json();
        if(data.success){
            setBookmarked(data.bookmarked);
        }
    }
    fetchbookmarkstatus();
  },[])

  useDidMountEffect(() => {
    if (bookmarked) {
      fetch("http://localhost:3000/api/BookMarking_Routes/edit_bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ id: id, thing: "property", action: "bookmark" }),
      })
    } else {
      fetch("http://localhost:3000/api/BookMarking_Routes/edit_bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ id: id, thing: "property", action: "unmark" }),
      })
    }
  }, [bookmarked])

  

  return (
    <div className={`property-card ${isPopping ? "pop-animate" : ""}`}>
      {/* Image Section */}
      <div className="image-container">
        <img src={image} alt={title} />
      </div>

      {/* Details Section */}
      <div className="details">
        <p className="price">{price}</p>
        <p className="description">{title}, {location}</p>
        <p className="bhk">{bhk}</p>
      </div>

      {/* Buttons Section */}
      <div className="buttons">
        <button className="bookmark-btn" onClick={toggleBookmark}>
          {bookmarked ? (
            <svg className="bookmark-svg" width="40" height="40" viewBox="0 0 30 30" fill="#8b1e2f">
              <path d="M6 3c-1.1 0-2 .9-2 2v16l8-5 8 5V5c0-1.1-.9-2-2-2H6z"></path>
            </svg>
          ) : (
            <svg className="bookmark-svg" width="40" height="40" viewBox="0 0 30 30" fill="none" stroke="#8b1e2f" strokeWidth="2">
              <path d="M6 3c-1.1 0-2 .9-2 2v16l8-5 8 5V5c0-1.1-.9-2-2-2H6z"></path>
            </svg>
          )}
        </button>
        <button className="view-button" onClick={handleView}>View</button>
      </div>
    </div>
  );
};

export default PropertyCardTenant;
