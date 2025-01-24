const User = require("../models/User");
const Post = require("../models/Post");
const Photo = require("../models/Photo");
const bcrypt = require("bcrypt");

const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;

        let user;

        if (username) {
            user = await User.findOne({ username }).select("-password");
        } else {
            user = await User.findById(req.userId).select("-password");
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ user: user._id });
        const photos = await Photo.find({ user: user._id });

        res.status(200).json({ user, posts, photos });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user profile", message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const updateUser = await User.findByIdAndUpdate(userId, { username, email, password: hashedPassword }, { new: true, runValidators: true });

        if (!updateUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updateUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile", message: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
};
