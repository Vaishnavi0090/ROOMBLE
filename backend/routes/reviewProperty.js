
const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Landlord = require('../models/Landlord');
const Tenant = require('../models/Tenant');
const checkUser = require('../middlewares/checkuser');



router.post('/addreview', checkUser, async (req, res) => {
    try{
        const {rating, review, propertyId} = req.body;
        const property = await Property.findById(propertyId);
        if(!property){
            return res.status(404).json({message: "Property not found", success: false});
        }

        // /check if already reviewed
        for(let i=0; i<property.reviews.length; i++){
            if(property.reviews[i].reviewer.toString() === req.user._id.toString()){
                return res.status(400).json({message: "You have already reviewed this property", success: false});
            }
        }

        const user = req.user;
        //reviewer, rivewertype, rating, comment to add in review
        const reviewObj = {
            reviewer: user._id,
            reviewertype: user.type,
            rating,
            comment: review
        }
        property.reviews.push(reviewObj);
        await property.save();
        return res.json({success: true, message: "Review added successfully"});
    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Internal Server Error", success: false});
    }
});

router.post('/getreviews', async (req, res) => {
    try{
        const {propertyId} = req.body;
        const property = await Property.findById(propertyId);
        if(!property){
            return res.status(404).json({error: "Property not found", success: false});
        }
        const reviews = [];
        for(let i=0; i<property.reviews.length; i++){
            const review = property.reviews[i];
            let user;
            if(review.reviewertype === 'Landlord'){
                user = await Landlord.findById(review.reviewer);
            }else{
                user = await Tenant.findById(review.reviewer);
            }
            reviews.push({
                rating: review.rating,
                comment: review.comment,
                name: user.name,
                email: user.email,
                image: user.Images
            });
        }
        return res.json({success: true, reviews});
    }catch(err){
        console.error(err);
        return res.status(500).json({error: "Internal Server Error", success: false});
    }
});

module.exports = router;