const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User"
    },
    status: {
        type: String
    },
    imageUrl: {
        type: String
    },
    dob: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    job: {
        type: String,
        required: true
    },
    tripdays: {
        type: Number
    },
    gender: {
        type: String,
        required: true
    },
    preferences: [
        {
            iconClass:{
                type: String
            },
            value:{
                type: String
            }
        }
    ],
    level:{
      type: Number
    },
    bio: {
        type: String
    },
    instagram: {
        type: String
    },
    facebook: {
        type: String
    },
    vk: {
        type: String
    },
    pinterest: {
        type: String
    },
    website: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("Profile", profileSchema)