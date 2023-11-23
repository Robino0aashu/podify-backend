const mongoose = require("mongoose");
// How to create a model
// Step 1 :require mongoose
// Step 2 :Create a mongoose schema (structure of a user)
// Step 3 : Create a model

const Record = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    podcasts: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Podcast",
        },
    ],
});

const RecordModel = mongoose.model("Record", Record);

module.exports = RecordModel;
