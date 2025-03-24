
const Landlord = require('../models/Landlord');
const Tenant = require('../models/Tenant');
const mongoose = require('mongoose');

/**
 * @desc Create a new review
 * @route POST /api/reviews
 * @access Public (Can be modified later to require authentication)
 */
const createReview = async (req, res) => {
    try{
        const revieweeid = (req.body.reviewee);
        const reviewerid = (req.user._id)
        const rating = req.body.rating;
        const comment = req.body.comment;
        const reviewertype = req.user.type;

        let reviewee = await Tenant.findById(revieweeid);
        let revieweetype = 'Tenant';
        if(!reviewee){
            reviewee = await Landlord.findById(revieweeid);
            revieweetype = 'Landlord';
        }
        if(!reviewee){
            return res.status(404).json({
                success : false,
                message : "Reviewee not found"
            })
        }
        const newReview = {
            reviewer : reviewerid,
            rating,
            comment,
            reviewertype
        }

        //checking if the reviewee is the same as the reviewer
        if(reviewerid.toString() === revieweeid.toString()){
            return res.status(400).json({
                success : false,
                message : "You cannot review yourself"
            })
        }
        //check if reviwer has already reviewed the reviewee
        let alreadyReviewed = false;
        reviewee.reviews.forEach(review => {
            if(review.reviewer.toString() === reviewerid.toString()){
                alreadyReviewed = true;
            }
        });
        if(alreadyReviewed){
            return res.status(400).json({
                success : false,
                message : "You have already reviewed this user"
            })
        }

        //pushing the review to the reviewee
        reviewee.reviews.push(newReview);
        // console.log(newReview);
        await reviewee.save();
        return res.status(200).json({
            success : true,
            message : "Review added successfully",
            review : newReview
        })
        
    }
    catch(e){
        // console.log(e);
        return res.status(500).json({
            success : false,
            message : "Server Error",
            error : e.message
        })
    }
};

/**
 * @desc Get all reviews for a specific Tenant or Landlord
 * @route GET /api/reviews/:revieweeId
 * @access Public
 */
const getReviewsForUser = async (req, res) => {
    try{
        const revieweeid = req.body.reviewee;
        let reviewee = await Tenant.findById(revieweeid);
        let revieweetype = 'Tenant';
        if(!reviewee){
            reviewee = await Landlord.findById(revieweeid);
            revieweetype = 'Landlord';
        }
        if(!reviewee){
            return res.status(404).json({
                success : false,
                message : "Reviewee not found"
            })
        }
        // add the reviewer name and image to the review
        let reviews = reviewee.reviews;
        for(let i=0; i<reviews.length; i++){
            let reviewer = await Tenant.findById(reviews[i].reviewer);
            if(!reviewer){
                reviewer = await Landlord.findById(reviews[i].reviewer);
            }
            reviews[i].reviewername = reviewer.name;
            reviews[i].reviewerimage = reviewer.Images;
        }
        return res.status(200).json({
            success : true,
            message : `Found ${reviews.length} reviews for ${revieweetype}`,
            reviews
        })
    }
    catch(e){
        // console.log(e);
        return res.status(500).json({
            success : false,
            message : "Server Error",
            error : e.message
        })
    }
};


module.exports = { createReview, getReviewsForUser};
