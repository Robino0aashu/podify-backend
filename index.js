
const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport=require("passport");
require('dotenv').config()

const cors=require("cors");
const User=require("./models/User")
const authRoutes=require("./routes/auth");
const podcastRoutes= require("./routes/podcast");
const recordRoutes= require("./routes/records");



const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
mongoose
    .connect(
        "mongodb+srv://Robino0aashu:"+process.env.MONGO_PASSWORD +"@cluster0.qgivmea.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    ).then((x) => {
        console.log("Connected to Mongo!");
    })
    .catch((err) => {
        console.log("Error while connecting to Mongo");
    });


// Passport JWT setup

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload.identifier}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));



app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.use("/auth", authRoutes);
app.use("/podcast", podcastRoutes);
app.use("/record", recordRoutes);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})
