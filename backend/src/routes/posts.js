const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createPost, getAllPosts, getPostsByUser, deletePost } = require("../controllers/postsController");

const router = express.Router();

router.post("/", authMiddleware, createPost);

router.get("/", getAllPosts);

router.get("/user/:userId", getPostsByUser);

router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
