import React, { useState, useContext, useEffect } from "react";
import "../css/PropertyDisplay.css";
import { Basecontext } from '../context/base/Basecontext';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

const PropertyDisplay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const state = useContext(Basecontext);
  const { user, setUser, fetuser } = state;
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
  const navigate = useNavigate();

  const params = useParams();
  const id = params.id;
  useEffect(() => {
    fetuser();
  }, [user])

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
          console.log(user);
          console.log(data.property.landlord);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProperty();

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


  return (
    <div className="property-display-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      {/* Left Section - Image Slider */}
      <div className="property-display-left">
        <div className="property-display-image-carousel">
          <button className="property-display-arrow left" onClick={handlePrev}><i class="fa-solid fa-chevron-left small-icon"></i></button>
          <img src={property.Images[currentIndex]} alt="Property" />
          <button className="property-display-arrow right" onClick={handleNext}><i class="fa-solid fa-chevron-right small-icon"></i></button>
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
            <button className="landlord-profile-edit-button" onClick={redirectto("landlord", property.landlord)}>Contact Owner</button>
          </div>}
      </div>
    </div>
  );
};

export default PropertyDisplay;
