const mongoose = require("mongoose");

let tripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User"
    },
    isTripReady: {
        type: Boolean
    },
    type: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    trip_description: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean
    },
    team:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectID,
                ref: "User"
            },
            imageUrl: {
                type: String
            },
            firstname: {
                type: String
            },
            secondname: {
                type: String
            },
            level: {
                type: Number
            },
            status: {
                type: String
            },
            tripdays: {
                type: Number
            },
            isReady: {
                type: Boolean
            }
        }
    ],
    st_point:{
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
        isSpReached:{
            type: Boolean
        },
        departureDate:{
            type: Date
        }
    },
    fn_destination:{
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
        fd_travelMode:{
            type: String
        },
        isFdReached:{
            type: Boolean
        },
        arrivalDate:{
            type: Date
        }
    },
    campContent: [
        {
            campImage:{
                type: String
            },
            campTitle:{
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
            },
            isCampReached:{
                type: Boolean
            },
            arrivalDate:{
                type: Date
            }
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: "Comment"
        }
    ],
    generalRating:{
        type: Number
    },
    ratings:[
        {
            user: {
                type: mongoose.Schema.Types.ObjectID,
                ref: "User"
            }
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Trip",tripSchema)