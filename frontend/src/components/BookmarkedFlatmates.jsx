import React, { useEffect, useState, useContext } from "react";
import FlatmateCard from "../components/FlatmateCard.jsx";
import "../css/BookmarkedFlatmates.css";
import { Basecontext } from "../context/base/Basecontext";
import { toast } from "react-toastify";
import PropertyCardTenant from "./FindPropertyComponents/PropertyCardTenant.jsx";

const BookmarkedFlatmates = () => {
  const [flatmates, setFlatmates] = useState([]);
  const [properties, setProperties] = useState([]);
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
          toast.error(data.message);
          return;
        }

        setFlatmates(data.FlatmateBookMarks);
        setProperties(data.PropertyBookMarks);
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
    <>
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
                compatibilityScore={flatmate.score}
                isBookmarked={true}
              />
            ))}
          </div>
        )}
      </div>
      <div className="bookmarked-page">
        <h1 className="page-title">Your Bookmarked Flatmates</h1>
        {properties.length === 0 ? (
          <p>No properties bookmarked yet.</p>
        ) : (
          <div className="flatmates-grid">
            {properties.map((property) => (
              <PropertyCardTenant
                key={property._id}
                image={property.Images[0]}
                price={property.price}
                title={property.name}
                location={`${property.address}`}
                bhk={property.bhk}
                onView={() => console.log("Viewing:", property.name)}
                onDelete={() => console.log("Deleting:", property._id)}
                id={property._id}
                available={property.available}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BookmarkedFlatmates;
