const express = require("express");
const passport = require("passport");
const Record = require("../models/Record");
const User = require("../models/User");
const Podcast = require("../models/Podcast");

const router = express.Router();


router.post(
    "/create",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const currentUser = req.user;
        const {name, thumbnail, podcasts} = req.body;
        if (!name || !thumbnail || !podcasts) {
            return res.status(301).json({err: "Insufficient data"});
        }
        const recordData = {
            name,
            thumbnail,
            podcasts,
            owner: currentUser._id,
            collaborators: [],
        };
        const record = await Record.create(recordData);
        return res.status(200).json(record);
    }
);

//get all records

router.get(
    "/get/all",
    //passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        try {
            const allRecords = await Record.find({}).populate('owner');
            return res.status(200).json({data: allRecords});
        } catch (err) {
            return res.status(500).json({err: "Error retrieving records"});
        }
    }
);

 
router.get(
    "/get/record/:recordId",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        // This concept is called req.params
        const recordId = req.params.recordId;
        // I need to find a Record with the _id = RecordId
        const record = await Record.findOne({_id: recordId}).populate({
            path: 'podcasts',
            populate:{
                path: 'speaker'
            }
        });
        if (!record) {
            return res.status(301).json({err: "Invalid ID"});
        }
        return res.status(200).json(record);
    }
);

// Get all Records made by me
// /get/me
router.get(
    "/get/me",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const ownerId = req.user._id;

        const records = await Record.find({owner: ownerId}).populate(
            "owner"
        );
        return res.status(200).json({data: records});
    }
);

// Get all Records made by an owner
// /get/owner/xyz
router.get(
    "/get/owner/:ownerId",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const ownerId = req.params.ownerId;

        // We can do this: Check if owner with given owner Id exists
        const owner = await User.findOne({_id: ownerId});
        if (!owner) {
            return res.status(304).json({err: "Invalid owner ID"});
        }

        const records = await Record.find({owner: ownerId});
        return res.status(200).json({data: records});
    }
);

// Add a Podcast to a Record
router.post(
    "/add/Podcast",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const currentUser = req.user;
        const {recordId, podcastId} = req.body;
        // Step 0: Get the Record if valid
        const record = await Record.findOne({_id: recordId});
        if (!record) {
            return res.status(304).json({err: "Record does not exist"});
        }

        // Step 1: Check if currentUser owns the Record or is a collaborator
        if (
            !record.owner.equals(currentUser._id) &&
            !record.collaborators.includes(currentUser._id)
        ) {
            return res.status(400).json({err: "Not allowed"});
        }
        // Step 2: Check if the Podcast is a valid Podcast
        const podcast = await Podcast.findOne({_id: podcastId});
        if (!podcast) {
            return res.status(304).json({err: "Podcast does not exist"});
        }

        // Step 3: We can now simply add the Podcast to the Record
        record.podcasts.push(podcastId);
        await record.save();

        return res.status(200).json(record);
    }
);

//Remove a podcast from record

router.post(
    "/remove/Podcast",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const currentUser = req.user;
        const { recordId, podcastId } = req.body;

        const record = await Record.findOne({ _id: recordId });
        if (!record) {
            return res.status(404).json({ err: "Record does not exist" });
        }
        if (
            !record.owner.equals(currentUser._id) &&
            !record.collaborators.includes(currentUser._id)
        ) {
            return res.status(403).json({ err: "Not allowed" });
        }

        const podcastIndex = record.podcasts.indexOf(podcastId);
        if (podcastIndex === -1) {
            return res.status(404).json({ err: "Podcast not found in the record" });
        }

        record.podcasts.splice(podcastIndex, 1);
        await record.save();

        return res.status(200).json(record);
    }
);

//deleting a record
router.delete(
    "/delete/:recordId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const currentUser = req.user;
        const recordId = req.params.recordId;

        const record = await Record.findOne({ _id: recordId });

        if (!record) {
            return res.status(404).json({ err: "Record not found" });
        }

        if (!record.owner.equals(currentUser._id)) {
            return res.status(403).json({ err: "Not allowed to delete this record" });
        }

        try {
            await Record.deleteOne({ _id: recordId });

            return res.status(200).json({ message: "Record deleted successfully" });
        } catch (error) {
            return res.status(500).json({ err: "Error deleting the record" });
        }
    }
);

module.exports = router;
