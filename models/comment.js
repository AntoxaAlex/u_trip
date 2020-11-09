const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User"
    },
    username: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectID,
                ref: "User"
            }
        }
    ],
    replies: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectID,
                ref: "User"
            },
            username: {
                type: String,
                required: true
            },
            profileImage: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type:Date,
                default: Date.now
            }
        }
    ],
    date: {
        type:Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Comment", commentSchema)