const mongoose = require("mongoose");
// How to create a model
// Step 1 :require mongoose
// Step 2 :Create a mongoose schema (structure of a user)
// Step 3 : Create a model

const Podcast = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    track: {
        type: String,
        required: true,
    },
    speaker: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
});

const PodcastModel = mongoose.model("Podcast", Podcast);

module.exports = PodcastModel;
