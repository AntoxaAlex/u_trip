const mongoose = require("mongoose");

let tripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User"
    },
    tripImage: {
        type: String
    },
    title: {
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
    isCompleted: {
        type: Boolean,
        required: true
    },
    sp_title:{
        type: String
    },
    sp_image:{
        type: String
    },
    sp_description:{
        type: String
    },
    sp_latitude:{
        type: String
    },
    sp_longitude:{
        type: String
    },
    campContent: [
        {
            campTitle:{
                type: String
            },
            campImage:{
                type: String
            },
            campDescription:{
                type: String
            },
            campLatitude:{
                type: String
            },
            campLongitude:{
                type: String
            }
        }
    ],
    fd_title:{
        type: String
    },
    fd_image:{
        type: String
    },
    fd_description:{
        type: String
    },
    fd_latitude:{
        type: String
    },
    fd_longitude:{
        type: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: "Comment"
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Trip",tripSchema)