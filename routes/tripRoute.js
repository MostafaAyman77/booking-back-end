const express = require("express");
const router = express.Router();
const { 
  filterTrips, 
  createTrip, 
  getTrip, 
  getTrips, 
  updateTrip, 
  deleteTrip 
} = require("../Controllers/tripController");

const authController = require("../Controllers/authController");

const {
  createTripValidator,
  getTripValidator,
  updateTripValidator,
  deleteTripValidator
} = require('../utils/validators/tripValidator');

// Public routes
router.get('/', getTrips);
router.get('/filter', filterTrips); // 👈 placed before :id
router.get('/:id', getTripValidator, getTrip);

// Protected & restricted routes
router.post(
  '/',
  createTripValidator,
  authController.protect,
  authController.restrictTo('admin'), // only admins can create
  createTrip
);

router.put(
  '/:id',
  updateTripValidator,
  authController.protect,
  authController.restrictTo('admin'),
  updateTrip
);

router.delete(
  '/:id',
  deleteTripValidator,
  authController.protect,
  authController.restrictTo('admin'),
  deleteTrip
);

module.exports = router;
