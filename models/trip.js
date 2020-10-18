const mongoose = require("mongoose");

let tripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User"
    },
    imageUrl: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    starting_point: {
        type: String,
        required: true
    },
    campContent: [
        {
            campTitle: {
                type: String
            },
            campImage: {
                type: String
            },
            campDescription: {
                type: String
            }
        }
    ],
    final_destination: {
        type: String,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
    },
    trip_description: {
        type: String,
        required: true
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: "Post"
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Trip",tripSchema)