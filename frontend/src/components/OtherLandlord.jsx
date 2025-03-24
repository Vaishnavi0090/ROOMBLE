import React, { useEffect, useState } from "react";
import "../css/LandlordProfileStyles/LandlordProfile.css";
import PropertyCard from "./LandlordDashboard/PropertyCard.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { Rating } from "@mui/material";

const OtherLandlord = () => {
  const [respData, setRespData] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const [reviews, setReviews] = useState([{
    reviewername: '',
    reviewerimage: '',
    rating: 0,
    comment: ''
  }]);

  const handleView = () => {
    navigate("/prop-display ");
  };
  const token = localStorage.getItem("authtoken");
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(token);
        const response = await fetch(
          "http://127.0.0.1:3000/api/view_profiles/other_users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ requested_id: params.id, accounttype: "landlord" }),
          }
        );
        const data = await response.json();
        setRespData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const fetchReviews = async () => {
      const response = await fetch("http://localhost:3000/api/reviews/reviewee", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reviewee: params.id })
      });
      const data = await response.json();
      if (data.success) {
          setReviews(data.reviews);
      }
  }
  fetchReviews();

  }, []);

  const messageclick = async () => {
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
        navigate('/chat/' + data.conversation_id);
    } else {
        console.log("Failed to create conversation");
    }
};

const reviewclick = () => {
    navigate('/review/' + params.id);
};

const redirectto = (type, id) => {
    if (type === 'tenant') {
        return () => navigate('/tenant/' + id);
    } else {
        return () => navigate('/landlord/' + id);
    }
  };

  if (!respData) {
    return <div className="landlord-profile-loading">Loading...</div>;
  }

  console.log(respData.Images);
  return (
    <div className="landlord-profile-container">
      {/* Combined Profile & Properties Section */}
      <div className="landlord-profile-content">
        <div className="landlord-profile-header">
          <img
            src={respData.Images}
            alt="Profile"
            className="landlord-profile-image"
          />
          <div className="landlord-profile-details">
            <div className="landlord-profile-item">
              <div className="landlord-profile-name">
                <p>
                  <span className="label">Full Name</span>{" "}
                  <span className="separator">:</span>
                  <span className="value">{respData.name}</span>
                </p>
              </div>
              <div className="landlord-profile-email">
                <p>
                  <span className="label">Email Address</span>{" "}
                  <span className="separator">:</span>
                  <span className="value">{respData.email}</span>
                </p>
              </div>
              <div className="landlord-profile-propCount">
                <p>
                  <span className="label">Properties Count</span>{" "}
                  <span className="separator">:</span>
                  <span className="value">{respData.message}</span>
                </p>
              </div>

              <div className="landlord-profile-buttons">
                <button
                  className="landlord-profile-edit-button"
                  onClick={messageclick}
                >
                  Message
                </button>
                <button
                  className="landlord-profile-edit-button"
                  onClick={reviewclick}
                >
                  Review
                </button>
                {/* <button
                  className="landlord-profile-delete-button"
                  onClick={handleDelete}
                >
                  Delete
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section (Still Inside the Same Container) */}
        <div className="landlord-profile-properties">
          {respData.Properties.map(({ _id, town, bhk, price, Images }) => (
            <PropertyCard
              key={_id}
              image={Images[0]}
              price={price}
              title="Prop Card"
              location={town}
              bhk={bhk}
              id={_id}
            />
          ))}
        </div>
      </div>

      <section className='reviews'>
                  <h2>Reviews</h2>
                  <div className='reviews-container'>
                      {reviews.map((review, index) => (
                          <div className="reviews1" key={index}>
                              <div className="reviews-user-details" onClick={redirectto(review.reviewertype, review.reviewer)}>
                                  <div className="reviews-user-image">
                                      <img src={review.reviewerimage} alt="" />
                                  </div>
                                  <div className="reviews-user-name">
                                      <b>{review.reviewername}</b>
                                      <div className="reviews-rating">
                                          <Rating name="half-rating" value={review.rating} precision={1} size="small" readOnly />
                                      </div>
                                  </div>
                              </div>
                              <div className="reviews-comment">
                                  {review.comment}
                              </div>
                          </div>
                      ))}
                      {reviews.length === 0 && <p>No reviews posted.</p>}
                  </div>
              </section>
    </div>
  );
};

export default OtherLandlord;
