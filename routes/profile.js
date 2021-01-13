const express = require("express");
const router = express.Router({mergeParams: true});
const auth = require("../middleware/auth");
const User = require("../models/user");
const Profile = require("../models/profile");
const Trip = require("../models/trip");
const Comment = require("../models/comment");
const config =require("config")
const { body, validationResult} = require("express-validator")
const multer  = require("multer")
const path = require("path")
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))

    }
})
const upload = multer({
    storage: storage,
    limits:{fileSize: 10000000},
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
})

const name = config.get("CLOUDINARY_NAME")
const key = config.get("CLOUDINARY_API_KEY");
const secret = config.get("CLOUDINARY_API_SECRET");

const cloudinary = require('cloudinary')

cloudinary.v2.config({
    cloud_name: name,
    api_key: key,
    api_secret: secret
})

function checkFileType(file, cb) {
    // Allowed ext
    console.log("File: "+ file)
    const fileTypes = /jpeg|jpg|png|gif/
    // Check ext
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    // Check mime
    const mimeType = fileTypes.test(file.mimetype)
    console.log(mimeType, extname)

    if (mimeType && extname) {
        return cb(null, true)
    } else {
        cb(new Error('Only images'))
    }
}

//Get own profile
router.get("/me",auth, async (req, res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate("user");
        if(!profile){
            console.log("There are no profile for this user")
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
        body("gender", "Please choose gender").not().isEmpty()
    ]
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({errors: errors.array()})
    }

    const {
        imageUrl,
        dob,
        place,
        job,
        preferences,
        gender,
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
    if(imageUrl) profileObj.imageUrl = imageUrl;
    if(dob) profileObj.dob = dob;
    if(place) profileObj.place = place;
    if(job) profileObj.job = job;
    if(preferences) {
        console.log(preferences)
        profileObj.preferences = [];
        preferences.map((preference)=>{
            profileObj.preferences.push(preference)
        })
    }
    if(gender) profileObj.gender = gender;
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
            profile.save()
        }
        //Create profile if not
        profileObj.tripdays = 0;
        profileObj.level = 0;
        profile = new Profile(profileObj);
        profile.save();
        res.json(profile)

    }catch (e) {
        res.status(500).send("Server error")
    }

    console.log("Profile is created");
})

//Set status
router.post("/status", auth, async (req, res)=>{
    const {status} = req.body
    try{
        const profile = await Profile.findOne({user: req.user.id});
        profile.status = status
        profile.save();
        res.json(profile)
    } catch (e) {
        console.log(e.message)
    }
})

//Upload avatar
router.post("/avatar", auth, upload.single("avatar"), async (req, res, next)=>{
    try {
        await cloudinary.v2.uploader.upload(req.file.path, (error, result) => {
            if(error){
                console.log(error)
            }
            res.json(result.secure_url);
        })
    }catch (e) {
        console.log(e)
    }
})

//Get all profiles
router.get("/", async (req, res)=>{
    try {
        const profiles = await  Profile.find().populate("user");
        res.json(profiles)

    }catch (e) {
        console.log(e.message);
        res.status(500).send("Server error")
    }
})

//Get all profiles except own
router.get("/except",auth, async (req, res)=>{
    try {
        const profiles = await  Profile.find({user: { $ne : req.user.id}}).populate("user");
        res.json(profiles)

    }catch (e) {
        console.log(e.message);
        res.status(500).send("Server error")
    }
})

//Get profile by id
router.get("/user/:id",async (req, res)=>{
    try {
        const profile = await  Profile.findOne({user: req.params.id}).populate("user");
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
        const trips = await Trip.find({"team.user": {$eq: req.user.id}}).populate({
            path: "team",
            populate: [{
                path: "user",
                model: "User"
            }]
        });
        await trips.map(trip=>{
            trip.team.map((teammate,i)=>{
                if(teammate.user._id.toString() === req.user.id){
                    console.log(teammate.user._id)
                    console.log(req.user.id)
                    trip.team.splice(i,1)
                    trip.save()
                }
            })
        })
        res.json({msg: "User removed"})
        await Profile.findOneAndRemove({user: req.user.id});
        await User.findOneAndRemove({_id: req.user.id});
        await Comment.findOneAndRemove({user: req.user.id});


    }catch (e) {
        console.log(e);
        if(e.kind === "ObjectId"){
            return res.status(404).json({msg:"Profile not found"})
        }
        return res.status(500).json({msg:"Server error"})
    }
})


module.exports = router;