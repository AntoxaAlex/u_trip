const express = require("express");
const router = express.Router({mergeParams: true});
const Trip = require("../models/trip");
const Post = require("../models/post");
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

//Find all trips
router.get("/",auth, async (req, res)=>{
    try{
        const trips = await Trip.find();
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
        body("starting_point", "Starting point is required").not().isEmpty(),
        body("final_destination", "Final destination is required").not().isEmpty(),
        body("from", "This field is required").not().isEmpty(),
        body("trip_description", "Description is required").not().isEmpty()
    ]
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {
        imageUrl,
        title,
        starting_point,
        campContent,
        final_destination,
        from,
        to,
        trip_description
    } = req.body

    const tripObj = {};
    tripObj.user = req.user.id
    if(imageUrl) tripObj.imageUrl = imageUrl;
    if(title) tripObj.title = title;
    if(starting_point) tripObj.starting_point = starting_point;
    if(campContent){
        tripObj.campContent = [];
        campContent.map((camp)=>{
            tripObj.campContent.push(camp)
        })
    }
    if(final_destination) tripObj.final_destination = final_destination;
    if(from) tripObj.from = from;
    if(to) tripObj.to = to;
    if(trip_description) tripObj.trip_description = trip_description;

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

//Upload main trip image
router.post("/tripimage", auth, upload.single("tripImage"), async (req, res, next)=>{
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
router.get("/show/:id", auth, async (req, res)=>{
    try{
        let trip = await Trip.findById(req.params.id).populate("posts");
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
        body("starting_point", "Starting point is required").not().isEmpty(),
        body("final_destination", "Final destination is required").not().isEmpty(),
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

//Delete trip
router.delete("/:id", auth, async (req, res)=>{
    try{
        await Trip.findByIdAndRemove(req.params.id);
        await Post.findOneAndRemove({user: req.user.id});

        res.send("Trip deleted")
    }catch (e) {
        res.status(500).send("Server error")
    }
})


module.exports = router
