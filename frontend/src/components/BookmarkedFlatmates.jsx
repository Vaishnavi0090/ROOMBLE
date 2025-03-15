import React from "react";
import FlatmateCard from "./FlatMateCard";
import ronav_img from "../../public/sampleUser_Img.png";
import "../css/BookmarkedFlatmates.css";

const BookmarkedFlatmates = () => {
  const flatmates = [
    { name: "Ronav", image: ronav_img, location: "Bengaluru, Karnataka" },
    { name: "Aarsh", image: ronav_img, location: "Mumbai, Maharashtra" },
    { name: "Bikram", image: ronav_img, location: "Delhi" },
    { name: "Hitarth", image: ronav_img, location: "Chennai, Tamil Nadu" },
    { name: "Saksham", image: ronav_img, location: "Pune, Maharashtra" },
    { name: "Ayushi", image: ronav_img, location: "Kolkata, West Bengal" },
    { name: "Dutta", image: ronav_img, location: "Kolkata, West Bengal" },
  ];

  return (
    <div className="bookmarked-page">
      <h1 className="page-title">Your Bookmarked Flatmates</h1>
      <div className="flatmates-grid">
        {flatmates.map((flatmate, index) => (
          <FlatmateCard key={index} {...flatmate} />
        ))}
      </div>
    </div>
  );
};

export default BookmarkedFlatmates;
