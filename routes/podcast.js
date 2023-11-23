const express = require("express");
const router = express.Router();
const passport = require("passport");
const Podcast = require("../models/Podcast");
const User = require("../models/User");

router.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { name, thumbnail, track } = req.body;
        if (!name || !thumbnail || !track) {
            return res
                .status(301)
                .json({ err: "Insufficient details to create Podcast." });
        }
        // req.user getss the user because of passport.authenticate
        console.log(req.user);
        const speaker = req.user._id;
        const podcastDetails = { name, thumbnail, track, speaker };
        const createdPodcast = await Podcast.create(podcastDetails);
        return res.status(200).json(createdPodcast);
    }
);

//get all podcast I have uploaded
router.get(
    "/get/myPodcasts",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        //console.log(req.user._id);
        const podcasts = await Podcast.find({ speaker: req.user._id }).populate("speaker");
        return res.status(200).json({ data: podcasts });
    }
);

//get podcast by speaker ID
router.get(
    "/get/speaker/:speakerId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const speakerId = req.params.speakerId;
        const speaker = await User.findOne({ _id: speakerId });

        if (!speaker) {
            return res.status(301).json({ err: "Speaker does not exist" });
        }

        const podcasts = await Podcast.find({ speaker: speakerId });
        return res.status(200).json({ data: podcasts });
    }
);

//get single podcast by name
router.get(
    "/get/podcastname/:podcastName",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const podcastName = req.params.podcastName;
        const regex = new RegExp(podcastName, "i"); // Creating a case-insensitive regex
        const podcasts = await Podcast.find({ name: { $regex: regex } }).populate("speaker");
        return res.status(200).json({ data: podcasts });
    }
);


module.exports = router;