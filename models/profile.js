const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User"
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
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    preferences: {
      type: [String],
      required: true
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