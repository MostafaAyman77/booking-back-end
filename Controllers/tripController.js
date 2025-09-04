const Trip = require('../models/Trip');
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');

// ------------------------------------------- //
// @desc    Get all trips
// @route   GET /api/v1/trips
// @access  Public
exports.getTrips = factory.getAll(Trip);

// ------------------------------------------- //
// @desc    Get single trip
// @route   GET /api/v1/trips/:id
// @access  Public
exports.getTrip = factory.getOne(Trip);

// ------------------------------------------- //
// @desc    Create new trip
// @route   POST /api/v1/trips
// @access  Private
exports.createTrip = factory.createOne(Trip);

// ------------------------------------------- //
// @desc    Update trip by ID
// @route   PUT /api/v1/trips/:id
// @access  Private
exports.updateTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!trip) {
    return next(new ApiError(`No trip found with ID ${req.params.id}`, 404));
  }

  res.status(200).json({ data: trip });
});

// ------------------------------------------- //
// @desc    Delete trip by ID
// @route   DELETE /api/v1/trips/:id
// @access  Private
exports.deleteTrip = factory.deleteOne(Trip);
