const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const mongoose = require('mongoose');

exports.createTripValidator = [
  check('name')
    .notEmpty()
    .withMessage('Trip name is required')
    .isLength({ min: 3 })
    .withMessage('Trip name must be at least 3 characters'),

  check('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  check('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid start date format'),

  check('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('Invalid end date format'),

  check('status')
    .optional()
    .isIn(['planned', 'active', 'completed', 'cancelled'])
    .withMessage('Invalid status value'),

  check('destination.name')
    .optional()
    .isString()
    .withMessage('Destination name must be a string'),

  check('destination.country')
    .optional()
    .isString()
    .withMessage('Destination country must be a string'),

  check('destination.city')
    .optional()
    .isString()
    .withMessage('Destination city must be a string'),

  check('travelers')
    .optional()
    .isArray()
    .withMessage('Travelers must be an array'),

  body('travelers.*.userId')
    .optional()
    .isMongoId()
    .withMessage('Invalid userId in travelers'),

  body('travelers.*.role')
    .optional()
    .isIn(['organizer', 'user'])
    .withMessage('Traveler role must be either organizer or user'),

  check('itinerary')
    .optional()
    .isArray()
    .withMessage('Itinerary must be an array'),

  body('itinerary.*.date')
    .optional()
    .isISO8601()
    .withMessage('Itinerary date must be a valid date'),

  body('itinerary.*.activities')
    .optional()
    .isArray()
    .withMessage('Activities must be an array'),

  // Budget
  check('budget.totalBudget')
    .optional()
    .isNumeric()
    .withMessage('Total budget must be a number'),

  check('budget.currency')
    .optional()
    .isString()
    .withMessage('Currency must be a string'),

  body('budget.expenses')
    .optional()
    .isArray()
    .withMessage('Expenses must be an array'),

  body('budget.expenses.*.category')
    .optional()
    .isString()
    .withMessage('Expense category must be a string'),

  body('budget.expenses.*.amount')
    .optional()
    .isNumeric()
    .withMessage('Expense amount must be a number'),

  body('budget.expenses.*.description')
    .optional()
    .isString()
    .withMessage('Expense description must be a string'),

  check('transportation')
    .optional()
    .isArray()
    .withMessage('Transportation must be an array'),

  body('transportation.*.type')
    .optional()
    .isString()
    .withMessage('Transportation type must be a string'),

  check('accommodation')
    .optional()
    .isArray()
    .withMessage('Accommodation must be an array'),

  body('accommodation.*.name')
    .optional()
    .isString()
    .withMessage('Accommodation name must be a string'),

  body('accommodation.*.type')
    .optional()
    .isString()
    .withMessage('Accommodation type must be a string'),

  body('accommodation.*.checkInDate')
    .optional()
    .isISO8601()
    .withMessage('Check-in date must be a valid date'),

  body('accommodation.*.checkOutDate')
    .optional()
    .isISO8601()
    .withMessage('Check-out date must be a valid date'),

  body('accommodation.*.location')
    .optional()
    .isString()
    .withMessage('Accommodation location must be a string'),

  check('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string'),

  check('createdBy')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),

  validatorMiddleware,
];

exports.getTripValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  validatorMiddleware,
];

exports.updateTripValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  body('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Trip name must be at least 3 characters'),

  body('status')
    .optional()
    .isIn(['planned', 'active', 'completed', 'cancelled'])
    .withMessage('Invalid status'),

  validatorMiddleware,
];

exports.deleteTripValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  validatorMiddleware,
];
