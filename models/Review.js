const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },
    // Trip-only compatibility
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", index: true },
    serviceType: {
      type: String,
      enum: ["trip", "hotel", "car"],
      required: true,
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String },
    comment: { type: String },
    helpful: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    reviewDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

reviewSchema.index({ serviceType: 1, serviceId: 1, createdAt: -1 });
reviewSchema.index({ rating: -1, createdAt: -1 });
reviewSchema.index({ trip: 1, createdAt: -1 });
//  prevent duplicate reviews per booking per user
reviewSchema.index({ user: 1, booking: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
