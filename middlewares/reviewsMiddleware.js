const Review = require('../models/Review');
exports.checkExistingReview = async (req, res, next) => {
    const review=await Review.findById(req.params.id);
    if (!review) {
        return res.status(404).json({ error: "Review not found" });
    }
    
    next();

}
exports.validateReviewOwnership = async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (review.user.toString() !== req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}