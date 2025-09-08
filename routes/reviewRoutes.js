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

// Create a review
router.post("/", CreateReview);

// Get all reviews
router.get("/", getAllReviews);

// Get reviews for a service (trip/hotel/car)
router.get("/:serviceType/:serviceId", getReviewsForService);

// Get review stats (average + total)
router.get("/:serviceType/:serviceId/stats", getReviewStats);

// Get a single review by id
router.get("/id/:id", getReviewById);

// Get reviews by user
router.get("/user/:userId", getReviewsByUser);

// Update a review
router.put("/:id", updateReview);

// Delete a review
router.delete("/:id", deleteReview);
// Mark review as helpful
router.post("/:id/helpful", markReviewHelpful);


module.exports = router;
