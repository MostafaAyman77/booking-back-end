const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingType: {
      type: String,
      enum: ["trip", "hotel", "car"],
      required: true,
    },
    serviceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Trip | Hotel | Car
    // Trip-only reference for trip bookings compatibility
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
    serviceName: { type: String },

    bookingDate: { type: Date, default: Date.now },
    bookingReference: { type: String, index: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    serviceDetails: {
      tripDetails: {
        startDate: { type: Date },
        endDate: { type: Date },
        guests: {
          adults: { type: Number, default: 1 },
          children: { type: Number, default: 0 },
        },
        itinerary: [{ type: Object }],
      },
      hotelDetails: {
        checkInDate: { type: Date },
        checkOutDate: { type: Date },
        roomType: { type: String },
        rooms: { type: Number },
        guests: { type: Number },
        specialRequests: { type: String },
      },
      carDetails: {
        pickupDate: { type: Date },
        returnDate: { type: Date },
        pickupLocation: { type: String },
        returnLocation: { type: String },
        driverAge: { type: Number },
        licenseNumber: { type: String },
      },
    },

    pricing: {
      basePrice: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      fees: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },

    // Flat totalAmount for consumers expecting a root field
    totalAmount: { type: Number },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    paymentMethod: { type: String },

    specialRequests: { type: String },
    cancellationPolicy: { type: String },
    refundAmount: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingType: 1, status: 1 });
bookingSchema.index({ serviceId: 1, bookingType: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ paymentStatus: 1, createdAt: -1 });
bookingSchema.index({ trip: 1, createdAt: -1 });

// Keep root totalAmount synced from pricing if not provided
bookingSchema.pre("save", function (next) {
  if (
    this.totalAmount == null &&
    this.pricing &&
    typeof this.pricing.totalAmount === "number"
  ) {
    this.totalAmount = this.pricing.totalAmount;
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
