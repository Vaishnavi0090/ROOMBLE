const Review = require('../models/Review');
const Landlord = require('../models/Landlord');
const Tenant = require('../models/Tenant');

/**
 * @desc Create a new review
 * @route POST /api/reviews
 * @access Public (Can be modified later to require authentication)
 */
const createReview = async (req, res) => {
    try {
        const { reviewer, reviewerType, reviewee, revieweeType, rating, comment } = req.body;

        // Validate reviewer and reviewee types
        if (!['Tenant', 'Landlord'].includes(reviewerType) || !['Tenant', 'Landlord'].includes(revieweeType)) {
            return res.status(400).json({ message: "Invalid reviewer or reviewee type" });
        }

        // Ensure reviewer and reviewee exist in the database
        const reviewerExists = reviewerType === 'Tenant' ? await Tenant.findById(reviewer) : await Landlord.findById(reviewer);
        const revieweeExists = revieweeType === 'Tenant' ? await Tenant.findById(reviewee) : await Landlord.findById(reviewee);

        if (!reviewerExists || !revieweeExists) {
            return res.status(404).json({ message: "Reviewer or Reviewee not found" });
        }

        // Create a new review
        const newReview = new Review({
            reviewer,
            reviewerType,
            reviewee,
            revieweeType,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json({ message: "Review added successfully", review: newReview });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * @desc Get all reviews for a specific Tenant or Landlord
 * @route GET /api/reviews/:revieweeId
 * @access Public
 */
const mongoose = require('mongoose'); // ✅ Import mongoose

const getReviewsForUser = async (req, res) => {
    try {
        console.log("Received reviewee ID:", req.params.id);

        // Convert string ID to ObjectId
        const revieweeId = new mongoose.Types.ObjectId(req.params.id);

        // Fetch reviews where reviewee matches the given ID
        const reviews = await Review.find({ reviewee: revieweeId });

        console.log("Found reviews:", reviews);

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this user." });
        }

        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
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
        const updatedReview = await Review.findByIdAndUpdate(
            new mongoose.Types.ObjectId(reviewId),
            { rating, comment },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review updated successfully", review: updatedReview });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
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

        // Convert reviewId to a valid ObjectId
        const deletedReview = await Review.findByIdAndDelete(new mongoose.Types.ObjectId(reviewId));

        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


module.exports = { createReview, getReviewsForUser, updateReview, deleteReview };
