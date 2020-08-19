const mongoose = require("mongoose");

let tripSchema = new mongoose.Schema({
    title: String,
    starting_point: String,
    final_destination: String,
    trip_duration: String,
    trip_description: String
})

module.exports = mongoose.model("Trip",tripSchema)