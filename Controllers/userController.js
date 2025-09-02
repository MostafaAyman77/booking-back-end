const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const slugify = require("slugify");
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcryptjs');

const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const createToken = require("../utils/createToken");

// ---------------- Get all users ----------------
// const getUsers = async (req, res, next) => {
//   try {
//     const users = await User.find();
//     res.status(200).json({
//       status: "success",
//       results: users.length,
//       data: { users },
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// ------------------------------------------- //

exports.getUsers = factory.getAll(User);

// ------------------------------------------- //

exports.getUser = factory.getOne(User);

// ------------------------------------------- //

exports.createUser = factory.createOne(User);

// ------------------------------------------- //

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// ------------------------------------------- //

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// ------------------------------------------- //

exports.deleteUser = factory.deleteOne(User);

// ------------------------------------------- //

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// ------------------------------------------- //

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// ------------------------------------------- //

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// ------------------------------------------- //

exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});

