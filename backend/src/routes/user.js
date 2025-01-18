const express = require("express");
const { getUserProfile, updateUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:username", getUserProfile);
router.put("/edit/:id", authMiddleware, updateUserProfile);

module.exports = router;
