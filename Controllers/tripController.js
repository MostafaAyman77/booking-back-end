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

// ------------------------------------------- //
// @desc    Filter trips with pagination & sorting
// @route   GET /api/v1/trips/filter
// @access  Public
exports.filterTrips = asyncHandler(async (req, res, next) => {
  const { 
    adults, 
    children, 
    minPrice, 
    maxPrice, 
    instantBook, 
    location, 
    facilities, 
    rating, 
    match, // "all" or "any" for facilities
    sort,  // e.g. "price,-rating"
    page = 1,
    limit = 10,
    fields // select specific fields
  } = req.query;

  // Build filter object
  let filter = {};

  // Guests filter
  if (adults) filter["guests.adults"] = { $gte: Number(adults) };
  if (children) filter["guests.children"] = { $gte: Number(children) };

  // Price range filter
  if (minPrice || maxPrice) {
    filter["budget.totalBudget"] = {};
    if (minPrice && Number(minPrice) >= 0) {
      filter["budget.totalBudget"].$gte = Number(minPrice);
    }
    if (maxPrice && Number(maxPrice) >= 0) {
      filter["budget.totalBudget"].$lte = Number(maxPrice);
    }
  }

  // Instant Book filter
  if (instantBook === "true") filter.instantBook = true;
  if (instantBook === "false") filter.instantBook = false;

  // Location filter (city or country)
  if (location) {
    filter.$or = [
      { "destination.city": new RegExp(location, "i") },
      { "destination.country": new RegExp(location, "i") },
    ];
  }

  // Facilities filter
  if (facilities) {
    const facilitiesArray = facilities.split(",");
    if (match === "all") {
      filter.facilities = { $all: facilitiesArray };
    } else {
      filter.facilities = { $in: facilitiesArray }; // default: match any
    }
  }

  // Rating filter (between 1–5)
  if (rating && rating >= 1 && rating <= 5) {
    filter.rating = Number(rating);
  }

  // Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  // Sorting
  let sortBy = { createdAt: -1 }; // default
  if (sort) {
    sortBy = sort.split(",").reduce((acc, field) => {
      if (field.startsWith("-")) {
        acc[field.substring(1)] = -1;
      } else {
        acc[field] = 1;
      }
      return acc;
    }, {});
  }

  // Select fields
  let selectFields = null;
  if (fields) {
    selectFields = fields.split(",").join(" ");
  }

  // Query DB
  const trips = await Trip.find(filter)
    .skip(skip)
    .limit(limitNum)
    .sort(sortBy)
    .select(selectFields);

  // Count for pagination metadata
  const total = await Trip.countDocuments(filter);

  res.status(200).json({
    status: "success",
    results: trips.length,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
    data: trips,
  });
});
