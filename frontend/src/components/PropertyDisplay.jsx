import React, { useState, useContext, useEffect } from "react";
import "../css/PropertyDisplay.css";
import { Basecontext } from '../context/base/Basecontext';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import { Backdrop, Box, Fade, Modal, Rating, TextareaAutosize, Typography } from "@mui/material";

const PropertyDisplay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const state = useContext(Basecontext);
  const { user, setUser, fetuser } = state;
  const [open, setOpen] = useState(false);
  const [property, setProperty] = useState({
    name: 'Loading...',
    city: 'Loading...',
    town: 'Loading...',
    address: 'Loading...',
    amenities: ['Loading...'],
    Images: ['Loading...'],
    area: "Loading...",
    available: "Loading...",
    bhk: "Loading...",
    description: 'Loading...',
    price: "Loading...",
    reviews: ["Loading..."],
  });
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([{
    rating: 0,
    comment: "Loading...",
    name: "Loading...",
    image: "/sample_useImage.jpg"
  }]);

  const params = useParams();
  const id = params.id;
  useEffect(() => {
    fetuser();
  }, [user])
  
  const fetchReviews = async () => {
    const res = await fetch('http://localhost:3000/api/reviewProperty/getreviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ propertyId: id })
    });
    const data = await res.json();
    if (data.success) {
      setReviews(data.reviews);
    }
  }

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/property/get_property`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        });
        const data = await response.json();
        if (data.success) {
          setProperty(data.property);
        }
        else{
          toast.error("Something went wrong. Please try again later.");
          navigate("/");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again later.");
        navigate("/");
      }
    };
    fetchProperty();

    fetchReviews();


  }, []);



  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? property.Images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === property.Images.length - 1 ? 0 : prevIndex + 1));
  };

  const redirectto = (type, id) => {
    if (type == "landlord") {
      return () => navigate(`/landlord/${id}`);
    }
    else if (type == "review") {
      return () => navigate(`/review/${id}`);
    }
    else {
      return () => navigate(`/tenant/${id}`);
    }
  }

  const handleDelist = async () => {
    const res = await fetch("http://localhost:3000/api/Listing_Delisting/List_Delist_Prop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authtoken": localStorage.getItem("authtoken")
      },
      body: JSON.stringify({ property_id: id, action: property.available ? "delist" : "enlist" })
    });
    const data = await res.json();
    if (data.success) {
      setProperty({ ...property, available: !property.available });
      // show toastify success
      toast.success(data.message);
    }
    else {
      // show toastify error
      toast.error(data.message);
    }
  }

  const handleEdit = () => {
    navigate(`/edit-property/${id}`);
  }

  const handleReview = () => {
    setOpen(true);
  }

  const handleClick = async () => {
    const res = await fetch("http://localhost:3000/api/reviewProperty/addreview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authtoken": localStorage.getItem("authtoken")
      },
      body: JSON.stringify({
        rating: rating,
        review: review,
        propertyId: id
      })
    });
    const data = await res.json();
    if (data.success) {
      setOpen(false);
      setReview("");
      setRating(0);
      toast.success(data.message);

      fetchReviews();
    }
    else {
      toast.error(data.message);
    }

  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#fde6e8',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    border: 'none',
    borderRadius: '3px',
    textAlign: 'center'


  };

  const handleClose = () => {
    setOpen(false);
  }




  return (
    <>
      <div className="property-display-container">
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="transition-modal-title" variant="h5" component="h2">
                Leave a review
              </Typography>
              <Rating name="half-rating" value={rating} precision={1} style={{ marginTop: "10px" }} onChange={(e, n) => { setRating(n) }} size="large" />
              <textarea id="transition-modal-description" value={review} onChange={(e) => { setReview(e.target.value) }} placeholder="Tell us about your experience." style={{ width: "100%", height: "100px", marginTop: "10px", padding: "10px", border: "none", outline: "none", borderRadius: "10px" }}></textarea>
              <button className='review-btn' onClick={handleClick}>Submit</button>

            </Box>
          </Fade>
        </Modal>

        {/* Left Section - Image Slider */}
        <div className="property-display-left">
          <div className="property-display-image-carousel">
            <button className="property-display-arrow left" onClick={handlePrev}><i className="fa-solid fa-chevron-left small-icon"></i></button>
            <img src={property.Images[currentIndex]} alt="Property" />
            <button className="property-display-arrow right" onClick={handleNext}><i className="fa-solid fa-chevron-right small-icon"></i></button>
          </div>
          <div className="property-display-price">₹{property.price}/Month</div>
          <div className="property-display-location">{property.address}</div>
          {/* <div className="property-display-location"><Link to={`/landlord/${property.landlord}`}>Contact Landlord</Link></div> */}
        </div>

        {/* Right Section - Property Details */}
        <div className="property-display-right">
          <div className="property-display-section">
            <h3>Description</h3>
            <p>{property.description}</p>
          </div>
          <div className="property-display-section">
            <h3>Amenities</h3>
            <ul>{property.amenities.map((item, index) => <li key={index}>{item}</li>)}</ul>
          </div>
          <div className="property-display-section">
            <h3>Area</h3>
            <p>{property.area} sqft</p>
          </div>
          <div className="property-display-section">
            <h3>BHK</h3>
            <p>{property.bhk}</p>
          </div>
          <div className="property-display-section">
            <h3>Availability</h3>
            <p>{property.available ? "Available for renting" : "Already rented"}</p>
          </div>
          {/* <div className="property-display-section">
          <h3>Landlord</h3>
          <Link to={`/landlord/${property.landlord}`}>View Profile</Link>
        </div> */}


          {user._id === property.landlord ? (
            <div className="property-display-buttons">
              <button className="landlord-profile-edit-button" onClick={handleEdit}>Edit</button>
              <button className="landlord-profile-edit-button" onClick={handleDelist}>{property.available ? "Delist" : "List"}</button>
            </div>
          ) :
            <div className="property-display-buttons">
              <button className="landlord-profile-edit-button" onClick={handleReview}>Review</button>
              <button className="landlord-profile-edit-button" onClick={redirectto("landlord", property.landlord)}>Contact Owner</button>
            </div>}
        </div>
      </div>
      <div className="reviews">
        <h2>Reviews</h2>
        <div className="reviews-container">
          {reviews.map((review, index) => (
            <div className="reviews1" key={index}>
              <div className="reviews-user-details">
                <div className="reviews-user-image">
                  <img src={review.image} alt="" />
                </div>
                <div className="reviews-user-name">
                  <b>{review.name}</b>
                  <div className="reviews-rating">
                    <Rating name="half-rating" value={review.rating} precision={1} size="small" readOnly />
                  </div>
                </div>
              </div>
              <div className="reviews-comment">
                <p>{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
        {reviews.length === 0 && <p>No reviews yet.</p>}
      </div>

    </>

  );
};

export default PropertyDisplay;
