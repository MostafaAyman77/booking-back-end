const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const mongoose = require('mongoose');

// ---------------- CREATE TRIP VALIDATOR ----------------
exports.createTripValidator = [
  check('name')
    .notEmpty()
    .withMessage('Please provide a name for the trip')
    .isLength({ min: 3 })
    .withMessage('Trip name should be at least 3 characters long'),

  check('description')
    .optional()
    .isString()
    .withMessage('Description must be a text'),

  check('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  check('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date'),

  check('status')
    .optional()
    .isIn(['planned', 'active', 'completed', 'cancelled'])
    .withMessage('Status must be one of: planned, active, completed, cancelled'),

  // Destination
  check('destination.name').optional().isString().withMessage('Destination name should be text'),
  check('destination.country').optional().isString().withMessage('Destination country should be text'),
  check('destination.city').optional().isString().withMessage('Destination city should be text'),

  // Guests
  check('guests.adults')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Number of adults should be at least 1'),
  check('guests.children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Number of children should be 0 or more'),

  // Travelers
  check('travelers')
    .optional()
    .isArray()
    .withMessage('Travelers should be a list of users'),
  body('travelers.*.userId')
    .optional()
    .isMongoId()
    .withMessage('Each traveler must have a valid user ID'),
  body('travelers.*.role')
    .optional()
    .isIn(['organizer', 'user'])
    .withMessage('Traveler role should be either organizer or user'),

  // Itinerary
  check('itinerary')
    .optional()
    .isArray()
    .withMessage('Itinerary should be a list of days with activities'),
  body('itinerary.*.date')
    .optional()
    .isISO8601()
    .withMessage('Each itinerary date must be valid'),
  body('itinerary.*.activities')
    .optional()
    .isArray()
    .withMessage('Activities should be listed as an array'),

  // Budget
  check('budget.totalBudget').optional().isNumeric().withMessage('Total budget should be a number'),
  check('budget.currency').optional().isString().withMessage('Currency should be text'),
  body('budget.expenses')
    .optional()
    .isArray()
    .withMessage('Expenses should be a list'),
  body('budget.expenses.*.category')
    .optional()
    .isString()
    .withMessage('Expense category should be text'),
  body('budget.expenses.*.amount')
    .optional()
    .isNumeric()
    .withMessage('Expense amount should be a number'),
  body('budget.expenses.*.description')
    .optional()
    .isString()
    .withMessage('Expense description should be text'),

  // Transportation
  check('transportation').optional().isArray().withMessage('Transportation should be a list'),
  body('transportation.*.type').optional().isString().withMessage('Transportation type should be text'),

  // Accommodation
  check('accommodation').optional().isArray().withMessage('Accommodation should be a list'),
  body('accommodation.*.name').optional().isString().withMessage('Accommodation name should be text'),
  body('accommodation.*.type').optional().isString().withMessage('Accommodation type should be text'),
  body('accommodation.*.checkInDate')
    .optional()
    .isISO8601()
    .withMessage('Check-in date must be valid'),
  body('accommodation.*.checkOutDate')
    .optional()
    .isISO8601()
    .withMessage('Check-out date must be valid'),
  body('accommodation.*.location').optional().isString().withMessage('Accommodation location should be text'),

  // Facilities
  check('facilities').optional().isArray().withMessage('Facilities should be a list'),
  body('facilities.*')
    .optional()
    .isIn(["Public Space","AC","24/7","TV","Refrigerator","Seating Area","Free Wifi"])
    .withMessage('Invalid facility selected'),

  // Instant Book
  check('instantBook')
    .optional()
    .isBoolean()
    .withMessage('Instant book must be true or false'),

  // Rating
  check('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating should be between 1 and 5'),

  // Notes
  check('notes').optional().isString().withMessage('Notes should be text'),

  // Created By
  check('createdBy').optional().isMongoId().withMessage('Invalid user ID'),

  validatorMiddleware,
];

// ---------------- GET TRIP VALIDATOR ----------------
exports.getTripValidator = [
  check('id').isMongoId().withMessage('Please provide a valid trip ID'),
  validatorMiddleware,
];

// ---------------- UPDATE TRIP VALIDATOR ----------------
exports.updateTripValidator = [
  check('id').isMongoId().withMessage('Please provide a valid trip ID'),

  // Optional updates
  body('name').optional().isLength({ min: 3 }).withMessage('Trip name should be at least 3 characters'),
  body('status').optional().isIn(['planned','active','completed','cancelled']).withMessage('Invalid status'),

  body('guests.adults').optional().isInt({ min: 1 }).withMessage('Number of adults should be at least 1'),
  body('guests.children').optional().isInt({ min: 0 }).withMessage('Number of children should be 0 or more'),
  body('facilities').optional().isArray().withMessage('Facilities should be a list'),
  body('facilities.*')
    .optional()
    .isIn(["Public Space","AC","24/7","TV","Refrigerator","Seating Area","Free Wifi"])
    .withMessage('Invalid facility selected'),
  body('instantBook').optional().isBoolean().withMessage('Instant book must be true or false'),
  body('rating').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating should be between 1 and 5'),

  validatorMiddleware,
];

// ---------------- DELETE TRIP VALIDATOR ----------------
exports.deleteTripValidator = [
  check('id').isMongoId().withMessage('Please provide a valid trip ID'),
  validatorMiddleware,
];
