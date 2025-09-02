const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../Controllers/userController");

const authService = require("../Controllers/authController");

const router = express.Router();

// Apply protection to all routes
router.use(authService.protect);

// User routes (for logged-in users)
router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

// Admin routes (require admin/manager role)
router.put(
  "/changePassword/:id",
  authService.allowedTo("admin", "manager"),
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(authService.allowedTo("admin", "manager"), getUsers)
  .post(
    authService.allowedTo("admin", "manager"),
    createUserValidator,
    createUser
  );

// Parameterized routes for admin operations
router
  .route("/:id")
  .get(authService.allowedTo("admin", "manager"), getUserValidator, getUser)
  .put(
    authService.allowedTo("admin", "manager"),
    updateUserValidator,
    updateUser
  )
  .delete(
    authService.allowedTo("admin", "manager"),
    deleteUserValidator,
    deleteUser
  );

module.exports = router;
