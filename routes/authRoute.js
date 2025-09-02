const express = require("express");
const asyncHandler = require("express-async-handler");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../Controllers/authController");

const User = require("../models/User");

const router = express.Router();

router.post("/register", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);

// Check if email exists
router.get(
  "/check-email/:email",
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.params.email });
    res.json({
      exists: !!user,
      message: user ? "Email already registered" : "Email available",
    });
  })
);

module.exports = router;
