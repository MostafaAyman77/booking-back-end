const Booking = require("../models/Booking");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");

exports.createBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.create({
        ...req.body,
         user: req.user._id
        });

    res.status(201).json({
        status: "success",
        data: {
            booking
        }
    });
})

exports.getAllBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find();

    res.status(200).json({
        status: "success",
        results: bookings.length,
        data: {
            bookings
        }
    });
})

exports.getBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);

    res.status(200).json({
        status: "success",
        data: {
            booking
        }
    });
})  


exports.updateBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: {
            booking
        }
    });
})
exports.cancelBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: "canceled" }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: {
            booking
        }
    });
})
exports.getMyBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find({ user: req.user._id });

    res.status(200).json({
        status: "success",
        results: bookings.length,
        data: {
            bookings
        }
    });
})
