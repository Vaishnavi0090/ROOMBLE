import React from 'react';
import "../css/FlatmateCardExpand.css";
import { BsBookmark, BsBookmarkFill, BsChatDots, BsStar, BsStarFill } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDidMountEffect from '../useDidMountEffect';
import { Rating } from '@mui/material';

const FlatmateCardExpand = () => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([{
        name: "Loading...",
        rating: 0,
        comment: "Loading...",
        image: "/sampleUser_Img.png"
    }]);

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

    useEffect(()=>{
        const fetchbookmarkstatus = async()=>{
            const response = await fetch('http://localhost:3000/api/BookMarking_Routes/check_bookmark',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authtoken': localStorage.getItem('authtoken')
                },
                body: JSON.stringify({ id: params.id, thing: "flatmate" })
            });
            const data = await response.json();
            if(data.success){
                setIsBookmarked(data.bookmarked);
            }
        }
        fetchbookmarkstatus();
    },[])

    useEffect(() => {
        const id = params.id;
        const token = localStorage.getItem("authtoken");
        // console.log("Token: ", token);

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

        const fetchReviews = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/reviews/reviewee', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ reviewee: id })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(`Error: ${response.status} - ${response.statusText}`, errorData);
                    return; 
                }

                const data = await response.json();

                if (data.success) {
                    setReviews(data.reviews);
                } else {
                    console.log("Failed to fetch reviews");
                }
            } catch (err) {
                    console.error("Error fetching reviews:", err);
            }
        }
        fetchReviews();

    }, [params.id]);

    useDidMountEffect(()=>{

        //update the bookmarks in the backend
        if(isBookmarked){
            console.log("Bookmarking");
            fetch('http://localhost:3000/api/BookMarking_Routes/edit_bookmarks',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authtoken': localStorage.getItem('authtoken')
                },
                body: JSON.stringify({ action: "bookmark", thing: "flatmate", id: params.id })
            })
        }
        else{
            console.log("Unbookmarking");
            fetch('http://localhost:3000/api/BookMarking_Routes/edit_bookmarks',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authtoken': localStorage.getItem('authtoken')
                },
                body: JSON.stringify({ action: "unmark", thing: "flatmate", id: params.id })
            })
        }

    },[isBookmarked]);

    const handleBookmarkClick = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleMessageClick = async () => {
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

    const handleReviewClick = () => {
        navigate(`/review/${params.id}`);
    };

    if (!user || Object.keys(user).length === 0) {
        return <p>No user data found.</p>;
    }

    const redirectto = (type, id) => {
        if(type === 'tenant'){
            return () => {navigate(`/tenant/${id}`);console.log(`redirecting to tenant ${id}`)};
        }
        else if(type === 'landlord'){
            return () => navigate(`/landlord/${id}`);
        }
    }

    return (
        <>
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
                    <p>{user.description === ""? "This user hasn't setup a description yet" : user.description}</p>

                    <div className="fce-action-buttons">
                        <div className="fce-bookmark-section" onClick={handleBookmarkClick}>
                            {isBookmarked ? (
                                <BsBookmarkFill className="fce-bookmark-icon filled" />
                            ) : (
                                <BsBookmark className="fce-bookmark-icon" />
                            )}
                        </div>

                        <button className="fce-message-btn" onClick={handleReviewClick}>
                            <BsStar className="fce-star-icon" /> Review
                        </button>
                        <button className="fce-message-btn" onClick={handleMessageClick}>
                            <BsChatDots className="fce-message-icon" /> Message
                        </button>
                    </div>
                </div>
            </div>
        </section>
        <section className='reviews'>
            <h2>Reviews</h2>
            <div className='reviews-container'>
                {reviews.map((review, index) => (
                    <div className="reviews1" key={index}>
                        <div className="reviews-user-details">
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
        </>
    );
};

export default FlatmateCardExpand;
