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

// Filter 

// @desc    Filter trips
// @route   GET /api/v1/trips/filter
// @access  Public
exports.filterTrips = async (req, res, next) => {
  try {
    const { 
      adults, 
      children, 
      minPrice, 
      maxPrice, 
      instantBook, 
      location, 
      facilities, 
      rating 
    } = req.query;

    // Build filter object
    let filter = {};

    // Guests filter
    if (adults) filter["guests.adults"] = { $gte: Number(adults) };
    if (children) filter["guests.children"] = { $gte: Number(children) };

    // Price range filter
    if (minPrice || maxPrice) {
      filter["budget.totalBudget"] = {};
      if (minPrice) filter["budget.totalBudget"].$gte = Number(minPrice);
      if (maxPrice) filter["budget.totalBudget"].$lte = Number(maxPrice);
    }

    // Instant Book filter
    if (instantBook) filter.instantBook = instantBook === "true";

    // Location filter (city or country)
    if (location) {
      filter.$or = [
        { "destination.city": new RegExp(location, "i") },
        { "destination.country": new RegExp(location, "i") },
      ];
    }

    // Facilities filter (must include all selected)
    if (facilities) {
      const facilitiesArray = facilities.split(",");
      filter.facilities = { $all: facilitiesArray };
    }

    // Rating filter
    if (rating) filter.rating = Number(rating);

    // Query DB
    const trips = await Trip.find(filter);

    res.status(200).json({
      status: "success",
      results: trips.length,
      data: trips,
    });
  } catch (err) {
    next(err);
  }
};
