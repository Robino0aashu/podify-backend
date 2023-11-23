const mongoose = require("mongoose");


const User = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        private: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    likedPodcast: [
        {
            // We will change this to array later
            type: String,
            default: "",
        }
    ],
    likedRecords: [
        {
            // We will change this to array later
            type: String,
            default: "",
        }
    ],
    subscribedSpeakers: {
        // We will change this to array later
        type: String,
        default: "",
    },
});

const UserModel = mongoose.model("User", User);

module.exports = UserModel;
