const express = require("express");
const router = express.Router({mergeParams: true});
const Trip = require("../models/trip")

//Find and display all trips
router.get("/home",(req, res)=>{
    Trip.find({},(err, trips)=>{
        if(err){
            console.log("Error "+err.message)
        }else{
            res.json(trips);
        }
    })
})

//Create new trip
router.post("/", (req, res)=>{
    let trip = new Trip(req.body);
    trip.save()
        .then(trip=>{
            res.status(200).json({"trip": "new trip has been successfully created "})
        })
        .catch(err=>{
            res.status(400).send("creating trip is failed" + err.message)
        })
})

//Show trip with a specific id
router.get("/show/:id", (req, res)=>{
    Trip.findById(req.params.id, (err, foundTrip)=>{
        if(err){
            console.log("Error "+err.message)
        }else{
            res.json(foundTrip);
        }
    })
})

//Find and display edit form
router.get("/edit/:id",(req, res)=>{
    Trip.findById(req.params.id, (err, foundTrip)=>{
        if(err){
            console.log("Error "+err.message)
        }else{
            res.json(foundTrip);
        }
    })
})

//Update trip
router.post("/edit/:id", (req, res)=>{
    Trip.findById(req.params.id, (err, foundTrip)=>{
        if(err){
            console.log("Error "+err.message)
        }else{
            if(!foundTrip){
                res.status(404).send("data is not found");
            }else{
                foundTrip.title = req.body.title;
                foundTrip.starting_point= req.body.starting_point;
                foundTrip.final_destination= req.body.final_destination;
                foundTrip.trip_duration= req.body.trip_duration;
                foundTrip.trip_description= req.body.trip_description;

                foundTrip.save().then(trip => {
                    res.json('Trip is updated!');
                })
                    .catch(err => {
                        res.status(400).send("Update not possible");
                    });
            }
        }
    })
})

//Delete trip
router.delete("/delete/:id", (req, res)=>{
    Trip.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            console.log("Error "+err.message)
        }
    })
})

module.exports = router;