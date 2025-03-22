import React, { useEffect, useState, useContext } from "react";
import FlatmateCard from "../components/FlatmateCard.jsx";
import "../css/BookmarkedFlatmates.css";
import { Basecontext } from "../context/base/Basecontext";

const BookmarkedFlatmates = () => {
  const [flatmates, setFlatmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(Basecontext); // Get user context for auth token

  useEffect(() => {
    const fetchBookmarkedFlatmates = async () => {
      const token = localStorage.getItem("authtoken");
      try {
        const response = await fetch("http://127.0.0.1:3000/api/BookMarking_Routes/get_bookmarks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authtoken: token, // Pass token in header
          },
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }

        setFlatmates(data.FlatmateBookMarks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedFlatmates();
  }, []);

  if (loading) return <div className="bookmarked-page">Loading bookmarks...</div>;
  if (error) return <div className="bookmarked-page">Error: {error}</div>;

  return (
    <div className="bookmarked-page">
      <h1 className="page-title">Your Bookmarked Flatmates</h1>
      {flatmates.length === 0 ? (
        <p>No flatmates bookmarked yet.</p>
      ) : (
        <div className="flatmates-grid">
          {flatmates.map((flatmate) => (
            <FlatmateCard
              key={flatmate._id}
              id={flatmate._id}
              name={flatmate.name}
              locality={flatmate.locality}
              city={flatmate.city || "Mumbai"}
              gender={flatmate.gender}
              image={flatmate.Images}
              compatibilityScore={flatmate.recommendationScore}
              isBookmarked= {true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkedFlatmates;
