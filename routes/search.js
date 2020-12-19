const express = require("express");
const router = express.Router({mergeParams: true});
const Profile = require("../models/profile");
const Trip = require("../models/trip");
const { body, validationResult} = require("express-validator")

router.get("/:value", async (req, res)=>{
    const value = req.params.value
    console.log(value)
    try {
        const trips = await Trip.find({$or: [{title: {$regex : value, $options: "i"}},{"st_point.sp_title": {$regex : value, $options: "i"}},{"fn_destination.fd_title": {$regex : value, $options: "i"}},{"campContent.campTitle": {$regex : value, $options: "i"}}]})
        const tripsWithUser = await Trip.find({$or: [{"team.firstname": {$regex : value, $options: "i"}},{"team.secondname": {$regex : value, $options: "i"}}]})
        const profiles = await Profile.find().populate("user")
        const newProfiles = await profiles.filter(profile=>profile.user.firstname.includes(value) || profile.user.secondname.includes(value) || (profile.user.firstname + " " + profile.user.secondname).includes(value))
        res.json({trips: trips.length>0 ? trips : null, tripsWithUser: tripsWithUser.length>0 ? tripsWithUser : null, profiles: newProfiles.length>0 ? newProfiles : null})
    }catch (e) {
        console.log(e.message)
    }
})

module.exports = router