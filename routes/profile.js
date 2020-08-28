const express = require("express");
const router = express.Router({mergeParams: true});
const auth = require("../middleware/auth");
const User = require("../models/user");
const Profile = require("../models/profile");
const { body, validationResult} = require("express-validator")


//Get own profile
router.get("/me",auth, async (req, res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate("user",["name", "avatar"]);
        if(!profile){
            return res.status(400).json({msg: "There are no profile for this user"})
        }
        res.json(profile);

    }catch (e) {
        console.log(e.message);
        res.status(500).send("Server error")
    }
})

//Create or update profile
router.post("/", [
    auth,
    [
        body("dob", "This field is required").not().isEmpty(),
        body("preferences", "This field is required").not().isEmpty(),
        body("inTrip", "Please choose status").not().isEmpty()
    ]
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {
        dob,
        preferences,
        inTrip,
        bio,
        instagram,
        facebook,
        vk,
        pinterest,
        website,
    } = req.body

    //Build profile object
    const profileObj = {};
    profileObj.user = req.user.id;
    if(dob) profileObj.dob = dob;
    if(preferences) {
        profileObj.preferences = preferences.split(", ").map((preference)=>preference.trim());
    }
    if(inTrip) profileObj.inTrip = inTrip;
    if(bio) profileObj.bio = bio;
    if(instagram) profileObj.instagram = instagram;
    if(facebook) profileObj.facebook = facebook;
    if(vk) profileObj.vk = vk;
    if(pinterest) profileObj.pinterest = pinterest;
    if(website) profileObj.website = website;

    try{
        let profile = await Profile.findOne({user: req.user.id});
        if(profile){
        //    Update profile
            profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileObj}, {new: true})
            return res.json(profile);
        }
        //Create profile if not
        profile = new Profile(profileObj);
        profile.save();
        res.json(profile)

    }catch (e) {
        res.status(500).send("Server error")
    }

    console.log("Profile is created");
})

//Get all profiles
router.get("/",auth, async (req, res)=>{
    try {
        const profiles = await  Profile.find().populate("user",["name", "avatar"]);
        res.json(profiles)

    }catch (e) {
        console.log(e.message);
        res.status(500).send("Server error")
    }
})

//Get profile by id
router.get("/user/:id",auth, async (req, res)=>{
    try {
        const profile = await  Profile.findOne({user: req.params.id}).populate("user",["name", "avatar"]);
        if(!profile){
            return res.status(404).json({msg:"Profile not found"})
        }

        res.json(profile)

    }catch (e) {
        console.log(e.message);
        if(e.kind === "ObjectId"){
            return res.status(404).json({msg:"Profile not found"})
        }
        return res.status(500).json({msg:"Server error"})
    }
})

//Delete user and profile by id
router.delete("/",auth, async (req, res)=>{
    try {
        await Profile.findOneAndRemove({user: req.user.id});
        await User.findOneAndRemove({_id: req.user.id});

        res.json({msg: "User removed"})

    }catch (e) {
        console.log(e.message);
        if(e.kind === "ObjectId"){
            return res.status(404).json({msg:"Profile not found"})
        }
        return res.status(500).json({msg:"Server error"})
    }
})


module.exports = router;