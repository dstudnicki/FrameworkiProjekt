const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadPhoto, getAllPhotos, getPhotoByUser, deletePhoto } = require("../controllers/photoController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", authMiddleware, upload.single("photo"), uploadPhoto);

router.get("/", getAllPhotos);

router.get("/user/:userId", getPhotoByUser);

router.delete("/:id", authMiddleware, deletePhoto);

module.exports = router;
