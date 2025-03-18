const Review = require('../models/Review');
const Landlord = require('../models/Landlord');
const Tenant = require('../models/Tenant');
const mongoose = require('mongoose');

/**
 * @desc Create a new review
 * @route POST /api/reviews
 * @access Public (Can be modified later to require authentication)
 */
const createReview = async (req, res) => {
    try {
        const { reviewer, reviewerType, reviewee, revieweeType, rating, comment } = req.body;

        // Prevent self-reviews
        if (reviewer === reviewee) {
            return res.status(400).json({ 
                success: false,
                message: "Users cannot review themselves" 
            });
        }

        // Prevent landlord-to-landlord reviews
        if (reviewerType === 'Landlord' && revieweeType === 'Landlord') {
            return res.status(400).json({
                success: false,
                message: "Landlords cannot review other landlords"
            });
        }

        // Validate reviewer and reviewee types
        if (!['Tenant', 'Landlord'].includes(reviewerType) || !['Tenant', 'Landlord'].includes(revieweeType)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid reviewer or reviewee type" 
            });
        }

        // Ensure reviewer and reviewee exist in the database
        const reviewerExists = reviewerType === 'Tenant' ? 
            await Tenant.findById(reviewer) : 
            await Landlord.findById(reviewer);
            
        const revieweeExists = revieweeType === 'Tenant' ? 
            await Tenant.findById(reviewee) : 
            await Landlord.findById(reviewee);

        if (!reviewerExists || !revieweeExists) {
            return res.status(404).json({ 
                success: false,
                message: "Reviewer or Reviewee not found" 
            });
        }

        // Create review for storing in Review collection (keeping existing functionality)
        const newReview = new Review({
            reviewer,
            reviewerType,
            reviewee,
            revieweeType,
            rating,
            comment
        });

        // Save to Review collection
        await newReview.save();

        // Create review object for embedding in user documents
        const reviewToEmbed = {
            reviewer,
            reviewerType,
            rating,
            comment,
            createdAt: new Date(),
            _id: newReview._id // Use the same ID as the standalone review
        };

        // Add review to reviewee document (either Tenant or Landlord)
        if (revieweeType === 'Tenant') {
            await Tenant.findByIdAndUpdate(
                reviewee,
                { $push: { reviews: reviewToEmbed } }
            );
        } else {
            await Landlord.findByIdAndUpdate(
                reviewee,
                { $push: { reviews: reviewToEmbed } }
            );
        }

        res.status(201).json({ 
            success: true,
            message: "Review added successfully", 
            review: newReview 
        });

    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ 
            success: false,
            message: "Server Error", 
            error: error.message 
        });
    }
};

/**
 * @desc Get all reviews for a specific Tenant or Landlord
 * @route GET /api/reviews/:revieweeId
 * @access Public
 */
const getReviewsForUser = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const revieweeId = new mongoose.Types.ObjectId(req.body.id);
        console.log("Looking for user with ID:", revieweeId);
        
        // First, try to find the user in Tenant collection
        let user = await Tenant.findById(revieweeId);
        let userType = 'Tenant';
        
        // If not found in Tenant, check Landlord collection
        if (!user) {
            console.log("Not found in Tenant, checking Landlord");
            user = await Landlord.findById(revieweeId);
            userType = 'Landlord';
            
            if (!user) {
                console.log("User not found in any collection");
                return res.status(404).json({ 
                    success: false,
                    message: "User not found" 
                });
            }
        }
        
        console.log("Found user:", user.name, "Type:", userType);

        // Check if user has any reviews
        if (!user.reviews || user.reviews.length === 0) {
            // Return success but with empty reviews array
            console.log("User has no reviews");
            return res.status(200).json({ 
                success: true,
                userType,
                message: "No reviews found for this user",
                reviews: []
            });
        }

        // Return ONLY reviews from user document
        console.log("Returning", user.reviews.length, "reviews");
        res.status(200).json({
            success: true,
            userType,
            reviews: user.reviews
        });

    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ 
            success: false,
            message: "Server Error", 
            error: error.message 
        });
    }
};

/**
 * @desc Update a review
 * @route PUT /api/reviews/:reviewId
 * @access Public (Can be modified later to require authentication)
 */
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        // Convert reviewId to a valid ObjectId
        const reviewObjectId = new mongoose.Types.ObjectId(reviewId);

        // First update in Review collection
        const existingReview = await Review.findByIdAndUpdate(
            reviewObjectId,
            { rating, comment },
            { new: true, runValidators: true }
        );

        if (!existingReview) {
            return res.status(404).json({ 
                success: false,
                message: "Review not found" 
            });
        }

        // Now update the embedded review in either Tenant or Landlord collection
        const { reviewee, revieweeType } = existingReview;
        
        // Update in the appropriate collection
        if (revieweeType === 'Tenant') {
            await Tenant.updateOne(
                { _id: reviewee, "reviews._id": reviewObjectId },
                { 
                    $set: { 
                        "reviews.$.rating": rating,
                        "reviews.$.comment": comment 
                    } 
                }
            );
        } else {
            await Landlord.updateOne(
                { _id: reviewee, "reviews._id": reviewObjectId },
                { 
                    $set: { 
                        "reviews.$.rating": rating,
                        "reviews.$.comment": comment 
                    } 
                }
            );
        }

        res.status(200).json({ 
            success: true,
            message: "Review updated successfully", 
            review: existingReview 
        });

    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ 
            success: false,
            message: "Server Error", 
            error: error.message 
        });
    }
};

/**
 * @desc Delete a review
 * @route DELETE /api/reviews/:reviewId
 * @access Public (Can be modified later to require authentication)
 */
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const reviewObjectId = new mongoose.Types.ObjectId(reviewId);

        // First, get the review to find out who it belongs to
        const reviewToDelete = await Review.findById(reviewObjectId);
        
        if (!reviewToDelete) {
            return res.status(404).json({ 
                success: false,
                message: "Review not found" 
            });
        }

        const { reviewee, revieweeType } = reviewToDelete;

        // Delete from Review collection
        await Review.findByIdAndDelete(reviewObjectId);

        // Also delete from the embedded array in Tenant or Landlord
        if (revieweeType === 'Tenant') {
            await Tenant.updateOne(
                { _id: reviewee },
                { $pull: { reviews: { _id: reviewObjectId } } }
            );
        } else {
            await Landlord.updateOne(
                { _id: reviewee },
                { $pull: { reviews: { _id: reviewObjectId } } }
            );
        }

        res.status(200).json({ 
            success: true,
            message: "Review deleted successfully" 
        });

    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ 
            success: false,
            message: "Server Error", 
            error: error.message 
        });
    }
};

module.exports = { createReview, getReviewsForUser, updateReview, deleteReview };
