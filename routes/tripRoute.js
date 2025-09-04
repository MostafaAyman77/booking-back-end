const express = require("express");
const router = express.Router();
const tripController = require("../Controllers/tripController");

const authController = require("../Controllers/authController");

const {
  createTripValidator,
  getTripValidator,
  updateTripValidator,
  deleteTripValidator
} = require('../utils/validators/tripValidator');

router.post('/', createTripValidator, authController.protect, authController.allowed("admin"), tripController.createTrip);
router.get('/', tripController.getTrips);
router.get('/:id', getTripValidator, tripController.getTrip);
router.put('/:id', updateTripValidator, tripController.updateTrip);
router.delete('/:id', deleteTripValidator, tripController.deleteTrip);

module.exports = router