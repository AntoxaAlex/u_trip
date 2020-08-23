const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User"
    },
    dob: {
        type: String,
        required: true
    },
    preferences: {
      type: [String],
      required: true
    },
    inTrip: {
      type: Boolean,
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