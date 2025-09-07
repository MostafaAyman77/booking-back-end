const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    location: {
      address: { type: String },
      city: { type: String, index: true },
      country: { type: String, index: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    amenities: [{ type: String }],
    // Rooms moved to separate collection; keep summary fields if needed
    roomTypes: [{ type: String }],
    images: [{ type: String }],
    rating: { type: Number, min: 1, max: 5, default: 5 },
    totalRooms: { type: Number, default: 0 },
    availableRooms: { type: Number, default: 0 },
    checkInTime: { type: String },
    checkOutTime: { type: String },
    policies: {
      cancellation: { type: String },
      checkIn: { type: String },
      checkOut: { type: String },
    },
    contact: {
      phone: { type: String },
      email: { type: String },
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Indexes for common queries
hotelSchema.index({ "location.city": 1, status: 1 });
hotelSchema.index({ "location.country": 1, status: 1 });
hotelSchema.index({ rating: -1, createdAt: -1 });
hotelSchema.index({ availableRooms: 1, status: 1 });

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
