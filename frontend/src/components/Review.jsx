import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../css/Review.css'
import { Rating } from '@mui/material'
import { Basecontext } from "../context/base/Basecontext";


export const Review = () => {
    const { id } = useParams()
    const[cuser, setcUser] = useState({"name": "User Name", "image": "/sampleUser_Img.png"})
    const [review, setReview] = useState("")
    const [rating, setRating] = useState(0)
    const [revieweetype, setRevieweeType] = useState("tenant")
    const { user } = useContext(Basecontext);

    useEffect(()=>{
        // Fetch user details from backend
        const fetchUser = async()=>{
            const response = await fetch('http://localhost:3000/api/view_profiles/user',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: id})
            });
            const data = await response.json();
            console.log(data)
            if(data.success){
                setcUser({
                    name: data.name,
                    image: data.profilepic
                })
                setRevieweeType(data.type)
            }
        }
        fetchUser()
    },[])

    const handleClick = async()=>{
        // Send review to backend
        const response = await fetch('http://localhost:3000/api/reviews/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authtoken: localStorage.getItem('authtoken')
            },
            body: JSON.stringify({
                reviewee: id,
                rating: rating,
                comment: review
            })
        });
        const data = await response.json();
        console.log(data)
    }
    
  return (
    <>
    <div className='review-container'>
        You are reviewing:
        <div className="review-user-details">
            <div className="review-user-name">
                {cuser.name}
            </div>
            <div className="review-user-image">
                <img src={cuser.image} alt="" />
            </div>
        </div>
    </div>
    <div className="review-form">
        <label htmlFor="review" className='review-form-label'>Review:</label>
        <Rating name="half-rating" value={rating} precision={1} size="large" onChange={(e, n)=>{setRating(n)}} />
        <textarea name="review" placeholder='Tell us about your experience' value={review} onChange={(e)=>{setReview(e.target.value)}}></textarea>
        <button className='review-btn' onClick={handleClick}>Submit</button>
    </div>
    </>
  )
}
