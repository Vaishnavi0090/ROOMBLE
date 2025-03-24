const express = require('express');
const { createReview, getReviewsForUser} = require('../controllers/reviewcontroller');
const checkUser = require('../middlewares/checkuser');

const router = express.Router();

// Create a new review
router.post('/', checkUser , createReview);

// Get all reviews for a user (Tenant/Landlord) - CHANGED FROM GET TO POST
router.post('/reviewee', getReviewsForUser);


module.exports = router;
