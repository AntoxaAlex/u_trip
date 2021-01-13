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
        const trips = await Trip.find({user: req.user.id}).populate({
            path: "team",
            populate: [{
                path: "user",
                model: "User"
            }]
        });
        res.json(trips);
    }catch (e) {
        res.status(500).send("Server error")
    }
})

//Find and display current trip
router.get("/current", auth, async (req, res)=>{
    try{
        if(!req.user.id){
            res.json(null)
        }
        const trip = await Trip.findOne({"team.user": {$eq: req.user.id}, isCompleted: false, isTripReady: true})
        if(!trip){
            const notReadyTrip = await Trip.findOne({"team.user": {$eq: req.user.id}, isCompleted: false, isTripReady: false})
            if(notReadyTrip){
                res.json({id: notReadyTrip, status: "not ready"})
            }
        } else {
            res.json(trip)
        }
    }catch (e) {
        res.status(500).send("Server error")
        console.log(e.message)
    }
})

//Confirm trip
router.put("/:id/confirm",[
    auth
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const trip = await Trip.findOne({"team.user": {$eq: req.user.id}, isCompleted: false, isTripReady: false});
        console.log("1")
        if(trip){
            trip.team.filter(teammate=>teammate.user.toString() === req.user.id).map(teammate=>{
                teammate.isReady = true
            })
            await trip.save()
            if(trip.team.filter(teammate=>teammate.isReady === false).length === 0){
                trip.isTripReady = true
                await trip.save()
                res.json(trip)
            } else {
                res.json({id: trip, status: "you ready"});
            }
            console.log("Trip is updated");
        }
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Server error")
    }
})

//Find and display current trip by user id
router.get("/:id/current", async (req, res)=>{
    try{
        const trip = await Trip.findOne({user: req.params.id, isCompleted: false});
        res.json(trip);
    }catch (e) {
        res.status(500).send("Server error")
    }
})

//Find all trips
router.get("/", async (req, res)=>{
    try{
        const trips = await Trip.find();
        res.json(trips);
    }catch (e) {
        res.status(500).send("Server error")
    }
})
//Find all user's trips
router.get("/all/:id", async (req, res)=>{
    try{
        const trips = await Trip.find({"team.user": {$eq: req.params.id}}).populate({
            path: "team",
            populate: [{
                path: "user",
                model: "User"
            }]
        });
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
        body("trip_description", "Description is required").not().isEmpty()
    ]
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {
        type,
        title,
        trip_description,
        from,
        to,
        team,
        st_point,
        fn_destination,
        campContent
    } = req.body

    const tripObj = {};
    tripObj.team = [];
    tripObj.user = req.user.id
    tripObj.type = {}
    tripObj.isTripReady = false
    tripObj.st_point = {}
    tripObj.fn_destination = {}
    if(type) tripObj.type = type
    if(title) tripObj.title = title;
    if(trip_description) tripObj.trip_description = trip_description;
    if(from) tripObj.st_point.departureDate = from;
    if(to) tripObj.fn_destination.arrivalDate = to;
    tripObj.isCompleted = false
    if(team) tripObj.team = team
    if(st_point) tripObj.st_point = st_point;
    if(fn_destination) tripObj.fn_destination = fn_destination;
    if(campContent){
        tripObj.campContent = [];
        campContent.map((camp)=>{
            tripObj.campContent.push(camp)
        })
    }
    tripObj.generalRating = 0
    tripObj.isCompleted = false

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
        let trip = await Trip.findById(req.params.id).populate({
            path: "team",
            populate: [{
                path: "user",
                model: "User"
            }]
        }).populate("comments user");
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
    auth
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        let trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate("comments user");
        await trip.save()
        res.json(trip);
        console.log("Trip is updated");
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Server error")
    }
})

//Reach point
router.put("/:id/reachPoint",  auth, async (req, res)=>{
    const {pointId} = req.body
    try{
        const trip = await Trip.findById(req.params.id).populate("comments user");
        if(pointId === "sp_check"){
            trip.st_point.isSpReached = true
            trip.st_point.departureDate = Date.now()
        } else if(pointId === "fd_check" && trip.st_point.isSpReached && trip.campContent.filter(camp=>!camp.isCampReached).length === 0){
            trip.fn_destination.isFdReached = true;
            trip.isCompleted = true;
            trip.fn_destination.arrivalDate = Date.now()
            trip.team.map(teammate=>{
                console.log(teammate.level)
                teammate.level +=1
                console.log(teammate.level)
            })
        } else {
            trip.campContent.filter((camp,i)=>parseInt(pointId) === i).map(camp=>{
                camp.isCampReached = true
            })
        }
        await trip.save()
        res.json(trip)


    }catch (e) {
        console.log(e)
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
