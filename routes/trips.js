const express = require("express");
const router = express.Router({mergeParams: true});
const Trip = require("../models/trip");
const Profile =require("../models/profile")
const Comment = require("../models/comment");
const auth = require("../middleware/auth");
const config =require("config");
const { body, validationResult} = require("express-validator");
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

//Find and display my trips
router.get("/me",auth, async (req, res)=>{
    try{
        const trips = await Trip.find({user: req.user.id});
        res.json(trips);
    }catch (e) {
        res.status(500).send("Server error")
    }
})

//Find and display current trip
router.get("/current",auth, async (req, res)=>{
    try{
        const trips = await Trip.findOne({user: req.user.id, isCompleted: false});
        res.json(trips);
    }catch (e) {
        res.status(500).send("Server error")
    }
})

//Find and display current trip by user id
router.get("/:id/current",auth, async (req, res)=>{
    try{
        const trips = await Trip.findOne({user: req.params.id, isCompleted: false});
        res.json(trips);
    }catch (e) {
        res.status(500).send("Server error")
    }
})

//Find all trips
router.get("/",auth, async (req, res)=>{
    try{
        const trips = await Trip.find();
        res.json(trips);
    }catch (e) {
        res.status(500).send("Server error")
    }
})
//Find all user's trips
router.get("/all/:id",auth, async (req, res)=>{
    try{
        const trips = await Trip.find({user: req.params.id});
        res.json(trips);
    }catch (e) {
        res.status(500).send("Server error")
    }
})

//Create new trip
router.post("/", [
    auth,
    [
        body("title", "Title is required").not().isEmpty(),
        body("from", "This field is required").not().isEmpty(),
        body("trip_description", "Description is required").not().isEmpty()
    ]
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {
        tripImage,
        tripType,
        title,
        trip_description,
        from,
        to,
        isCompleted,
        assembledTeammates,
        sp_title,
        sp_description,
        sp_image,
        sp_latitude,
        sp_longitude,
        campContent,
        fd_title,
        fd_description,
        fd_image,
        fd_latitude,
        fd_longitude
    } = req.body

    console.log(req.body)
    const tripObj = {};
    tripObj.team = [];
    tripObj.user = req.user.id
    if(tripImage) tripObj.tripImage = tripImage;
    if (tripType) tripObj.type = tripType
    if(title) tripObj.title = title;
    if(trip_description) tripObj.trip_description = trip_description;
    if(from) tripObj.from = from;
    if(to) tripObj.to = to;
    tripObj.isCompleted = false
    if(assembledTeammates) {
        assembledTeammates.map(teammate=>{
            tripObj.team.unshift({
                _id: teammate._id,
                user: teammate.user._id,
                avatar: teammate.imageUrl,
                username: teammate.user.firstname + " " + teammate.user.secondname
                })
        })
    }
    if(sp_title) tripObj.sp_title = sp_title;
    if(sp_description) tripObj.sp_description = sp_description;
    if(sp_image) tripObj.sp_image = sp_image;
    if(sp_latitude) tripObj.sp_latitude = sp_latitude;
    if(sp_longitude) tripObj.sp_longitude = sp_longitude;
    if(fd_title) tripObj.fd_title = fd_title;
    if(fd_description) tripObj.fd_description = fd_description;
    if(fd_image){
        console.log(sp_image)
        tripObj.fd_image = fd_image;
    }
    if(fd_latitude) tripObj.fd_latitude = fd_latitude;
    if(fd_longitude) tripObj.fd_longitude = fd_longitude;
    if(campContent){
        tripObj.campContent = [];
        campContent.map((camp)=>{
            tripObj.campContent.push(camp)
        })
    }

    try{
        let trip = new Trip(tripObj);
        await trip.save();
        res.json(trip);
        console.log("New trip is created" + trip)
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Server error")
    }
})


router.post("/uploadImage", auth, upload.single("file"), async (req,res)=>{
    try {
        await cloudinary.v2.uploader.upload(req.file.path, (error, result) => {
            if (error) {
                console.log(error)
            }
            res.json(result.secure_url);
        })

    }
    catch (e) {
        console.log(e.message);
    }
})


//Upload main trip image
router.post("/tripImage", auth, upload.single("tripImage"), async (req, res, next)=>{
    try {
        // await cloudinary.v2.uploader.upload(req.file.path, (error, result) => {
        //     if(error){
        //         console.log(error)
        //     }
        //     res.json(result.secure_url);
        // })
        console.log(req.file)
    }catch (e) {
        console.log(e)
    }
})

router.post("/sp_image", auth, upload.single("sp_image"), async (req, res, next)=>{
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

router.post("/fd_image", auth, upload.single("fd_image"), async (req, res, next)=>{
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

//Upload camp images
router.post("/campImage", auth, upload.single("campImage"), async (req, res, next)=>{
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

//Show trip with a specific id
router.get("/:id", auth, async (req, res)=>{
    try{
        let trip = await Trip.findById(req.params.id).populate("comments");
        if(!trip){
            res.status(404).send("Trip not found")
        }
        res.json(trip)
    }catch (e) {
        res.status("500").send("Server error")
    }

})

//Update trip
router.put("/:id",[
    auth,
    [
        body("title", "Title is required").not().isEmpty(),
        body("from", "This field is required").not().isEmpty(),
        body("trip_description", "Description is required").not().isEmpty()
    ]
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        let trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(trip);
        console.log("Trip is updated");
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Server error")
    }
})

//Immediately complete trip
router.put("/:id/complete",[
    auth,
    [
        body("to", "To is required").not().isEmpty(),
    ]
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        let trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(trip);
        console.log("Trip is updated");
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Server error")
    }
})

//Delete trip
router.delete("/:id", auth, async (req, res)=>{
    try{
        await Trip.findByIdAndRemove(req.params.id);
        await Comment.findOneAndRemove({user: req.user.id});

        const profile = await Profile.findOne({user:req.user.id})
        console.log("Trip deleted")
        res.json(profile)
    }catch (e) {
        res.status(500).send("Server error")
    }
})

//Set rating
router.post("/:id/rating",  auth, async (req, res)=>{
    try{
        const trip = await Trip.findById(req.params.id);
        if(trip.ratings.filter(rating => rating.user.toString()===req.user.id).length === 0){
            const ratingNumber = parseInt(req.body.val)
            console.log(ratingNumber)
            console.log(trip.generalRating)
            trip.generalRating = Math.floor((trip.generalRating + ratingNumber)/2);
            trip.ratings.unshift({user: req.user.id});
            await trip.save();
            res.json(trip);
        }


    }catch (e) {
        console.log(e)
    }
})

module.exports = router
