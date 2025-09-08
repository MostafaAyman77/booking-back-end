const Review= require("../models/Review");

exports.CreateReview = async (req, res) => {
  try {
    const { user, booking, trip, serviceType, serviceId, rating, title, comment } = req.body;
     if (booking) {
      const existingReview = await Review.findOne({ user, booking });
      if (existingReview) {
        return res.status(400).json({ error: "You already reviewed this booking" });
      }
    }
    const review = await Review.create({
      user,
      booking,
      trip,
      serviceType,
      serviceId,
      rating,
      title,
      comment,
    });
    res.status(201).json({ data: review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({ data: reviews });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getReviewsForService = async (req, res) => {
  try {
    const { serviceType, serviceId } = req.params;
    const reviews = await Review.find({ serviceType, serviceId });
    res.status(200).json({ data: reviews });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json({ data: review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ user: userId });
    res.status(200).json({ data: reviews });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, req.body, { new: true });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json({ data: review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getReviewStats = async (req, res) => {
  try {
    const { serviceType, serviceId } = req.params;
    const reviews = await Review.find({ serviceType, serviceId });
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalReviews ? totalRating / totalReviews : 0;
    res.status(200).json({ data: { totalReviews, averageRating } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.markReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({ data: review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
