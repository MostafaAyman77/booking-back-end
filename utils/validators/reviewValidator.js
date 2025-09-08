const { check } = require("express-validator");

exports.createReviewValidator = [
  check("user").notEmpty().withMessage("User ID is required"),
  check("rating")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  check("title")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters"),
  check("comment")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Comment must be at most 500 characters"),
];

exports.checkExistingReview = async (req, res, next) => {
  const { user, booking } = req.body;
  if (booking) {
    const existingReview = await Review.findOne({ user, booking });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You already reviewed this booking" });
    }
  }
  next();
};

