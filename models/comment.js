const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    },
    name:{
        type: String
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectID,
                ref: "User"
            }
        }
    ],
    answers: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectID,
                ref: "User"
            },
            text: {
                type: String,
                required: true
            },
            name:{
                type: String
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