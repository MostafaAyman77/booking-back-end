const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number },

    status: {
      type: String,
      enum: ["planned", "active", "completed", "cancelled"],
      default: "planned",
      index: true,
    },

    guests: {
      adults: { type: Number, default: 1, min: 1 },
      children: { type: Number, default: 0, min: 0 },
    },

    destination: {
      name: { type: String },
      country: { type: String, index: true },
      city: { type: String, index: true },
    },

    travelers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["organizer", "user"], default: "user" },
      },
    ],

    itinerary: [
      {
        date: { type: Date },
        activities: [
          {
            name: { type: String },
            time: { type: String },
            location: { type: String },
            description: { type: String },
          },
        ],
      },
    ],

    budget: {
      totalBudget: { type: Number, min: 0 },
      currency: { type: String },
      expenses: [
        {
          category: { type: String },
          amount: { type: Number, min: 0 },
          description: { type: String },
        },
      ],
    },

    transportation: [
      {
        type: { type: String },
        details: { type: Object },
      },
    ],

    accommodation: [
      {
        name: { type: String },
        type: { type: String },
        checkInDate: { type: Date },
        checkOutDate: { type: Date },
        location: { type: String },
      },
    ],

    facilities: [
      {
        type: String,
        enum: [
          "Public Space",
          "AC",
          "24/7",
          "TV",
          "Refrigerator",
          "Seating Area",
          "Free Wifi",
        ],
      },
    ],

    instantBook: { type: Boolean, default: false },

    rating: { type: Number, min: 1, max: 5, default: 5 },

    notes: { type: String },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

tripSchema.index({ status: 1, startDate: 1 });
tripSchema.index({ "destination.city": 1, startDate: 1 });
tripSchema.index({ createdAt: -1 });

tripSchema.pre("save", function (next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(
      this.endDate.getTime() - this.startDate.getTime()
    );
    this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  next();
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
