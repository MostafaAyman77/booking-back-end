const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  duration: Number, 
  status: {
    type: String,
    enum: ['planned', 'active', 'completed', 'cancelled'],
    default: 'planned',
  },
  destination: {
    name: String,
    country: String,
    city: String,
  },
  travelers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['organizer', 'user'],
        default: 'user',
      },
    },
  ],
  itinerary: [
    {
      date: Date,
      activities: [
        {
          name: String,
          time: String,
          location: String,
          description: String,
        },
      ],
    },
  ],
  budget: {
    totalBudget: Number,
    currency: String,
    expenses: [
      {
        category: String,
        amount: Number,
        description: String,
      },
    ],
  },
  transportation: [
    {
      type: String,
      details: Object, // Flexible for flight numbers, train times, etc.
    },
  ],
  accommodation: [
    {
      name: String,
      type: String,
      checkInDate: Date,
      checkOutDate: Date,
      location: String,
    },
  ],
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
},
{
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Pre-save hook to calculate duration
tripSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  next();
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;