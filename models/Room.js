const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
    type: { type: String, required: true }, // Single, Double, Suite
    name: { type: String },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, default: 1, min: 1 },
    amenities: [{ type: String }],
    images: [{ type: String }],
    available: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

roomSchema.index({ hotel: 1, type: 1 });
roomSchema.index({ price: 1 });
roomSchema.index({ createdAt: -1 });

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
