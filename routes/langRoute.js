const express = require("express");
const {getAllLanguages,  getLanguage, updateLanguage } = require("../Controllers/langController");
const { protect, allowedTo } = require("../Controllers/authController");

const router = express.Router();

router.get("/", getAllLanguages);
router.get("/lang", getLanguage);
router.patch("/", protect, allowedTo("admin"), updateLanguage);

module.exports = router;
