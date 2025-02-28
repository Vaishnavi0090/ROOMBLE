const express = require('express');
const { createReview, getReviewsForUser, updateReview, deleteReview } = require('../controllers/reviewcontroller');

const router = express.Router();

// Create a new review
router.post('/', createReview);

// Get all reviews for a user (Tenant/Landlord)
router.get('/reviewee/:id', getReviewsForUser);

// Update a review
router.put('/review/:reviewId', updateReview);

// Delete a review
router.delete('/review/:reviewId', deleteReview);

module.exports = router;
