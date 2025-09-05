const express = require("express");
const router = express.Router();
const { filterTrips, createTrip, getTrip, getTrips, updateTrip, deleteTrip } = require("../Controllers/tripController");

const authController = require("../Controllers/authController");

const {
  createTripValidator,
  getTripValidator,
  updateTripValidator,
  deleteTripValidator
} = require('../utils/validators/tripValidator');

router.post('/', createTripValidator, authController.protect, createTrip);
router.get('/', getTrips);
router.get('/:id', getTripValidator, getTrip);
router.put('/:id', updateTripValidator, updateTrip);
router.delete('/:id', deleteTripValidator, deleteTrip);
router.get("/filter", filterTrips);

module.exports = router