const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    type: { type: String }, // sedan, suv, etc.
    transmission: { type: String, enum: ["Manual", "Automatic"] },
    fuelType: { type: String },
    seats: { type: Number },
    luggage: { type: Number },
    features: [{ type: String }],
    images: [{ type: String }],
    location: {
      pickupLocation: { type: String },
      city: { type: String, index: true },
      country: { type: String, index: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    pricing: {
      dailyRate: { type: Number, required: true },
      weeklyRate: { type: Number },
      monthlyRate: { type: Number },
      currency: { type: String, default: "USD" },
    },
    availability: {
      startDate: { type: Date },
      endDate: { type: Date },
      isAvailable: { type: Boolean, default: true },
    },
    requirements: {
      minAge: { type: Number, default: 18 },
      licenseRequired: { type: String },
      deposit: { type: Number, default: 0 },
    },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    status: {
      type: String,
      enum: ["available", "rented", "maintenance"],
      default: "available",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Indexes for common queries
carSchema.index({ "location.city": 1, type: 1, status: 1 });
carSchema.index({ "pricing.dailyRate": 1, seats: 1, status: 1 });
carSchema.index({ createdAt: -1 });

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
