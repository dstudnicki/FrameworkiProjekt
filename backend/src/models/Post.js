const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"],
    },
    content: {
        type: String,
        required: [true, "Please provide content"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Post", postSchema);
