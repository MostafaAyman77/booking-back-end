const express = require("express");
const router = express.Router();
const {
  CreateReview,
  getAllReviews,
  getReviewsForService,
  getReviewById,
  getReviewsByUser,
  updateReview,
  deleteReview,
  getReviewStats,
markReviewHelpful
} = require("../Controllers/reviewController");
const { createReviewValidator } = require("../utils/validators/reviewValidator");
const { protect } = require("../middlewares/authMiddleware");
const { checkExistingReview, validateReviewOwnership } = require("../middlewares/reviewsMiddleware");



// Create a review
router.post("/", createReviewValidator, protect, CreateReview);

// Get all reviews
router.get("/", getAllReviews);


// Get a single review by id
router.get("/id/:id", getReviewById);

// Get reviews for a service (trip/hotel/car)
router.get("/:serviceType/:serviceId", getReviewsForService);

// Get review stats (average + total)
router.get("/:serviceType/:serviceId/stats", getReviewStats);


// Get reviews by user
router.get("/user/:userId", getReviewsByUser);

// Update a review
router.put("/:id", protect, checkExistingReview, validateReviewOwnership, updateReview);

// Delete a review
router.delete("/:id", protect, checkExistingReview, validateReviewOwnership, deleteReview);

// Mark review as helpful
router.post("/:id/helpful", protect, checkExistingReview, markReviewHelpful);


module.exports = router;
