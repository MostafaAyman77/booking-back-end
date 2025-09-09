const express = require("express");
const { createBooking,
    getAllBookings,
    getBooking,
    updateBooking,
    cancelBooking,
    getMyBookings
 } = require("../Controllers/bookingController");
const Router = express.Router();

Router.post("/", createBooking);

Router.get("/myBookings", getMyBookings);

Router.get("/", getAllBookings);

Router.get("/:id", getBooking);

Router.put("/:id", updateBooking);

Router.put("/cancel/:id", cancelBooking);
