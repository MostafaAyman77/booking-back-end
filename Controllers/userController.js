const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const slugify = require("slugify");
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const createToken = require("../utils/createToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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

// ------------------------------------------- //
// Send 2FA code to email for password change
// ------------------------------------------- //
exports.send2FACode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  // Generate random 6-digit code
  const code = crypto.randomInt(100000, 999999).toString();

  // Save to user with expiry (10 mins)
  user.twoFactorCode = code;
  user.twoFactorCodeExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Send email
  await sendEmail({
    email: user.email,
    subject: "Your 2FA Verification Code",
    message: `Your password reset verification code is: ${code}\nThis code will expire in 10 minutes.`,
  });

  res.status(200).json({
    message: "2FA code sent to your email",
  });
});


exports.verify2FACodeAndChangePassword = asyncHandler(async (req, res, next) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }


  if (
    user.twoFactorCode !== code ||
    user.twoFactorCodeExpires < Date.now()
  ) {
    return next(new ApiError("Invalid or expired code", 400));
  }

  // Update password
  user.password = await bcrypt.hash(newPassword, 12);
  user.passwordChangedAt = Date.now();
  user.twoFactorCode = undefined;
  user.twoFactorCodeExpires = undefined;
  await user.save();

  // Send confirmation email
  await sendEmail({
    email: user.email,
    subject: "Password Changed Successfully",
    message: "Your password has been updated. If this wasn't you, contact support immediately.",
  });

  res.status(200).json({ message: "Password changed successfully" });
});

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

