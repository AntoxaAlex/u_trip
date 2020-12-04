const express = require("express");
const router = express.Router({mergeParams: true});
const { body, validationResult} = require("express-validator");
const Comment = require("../models/comment");
const Trip = require("../models/trip");
const auth = require("../middleware/auth");


//Show comment with a specific id
router.get("/:comment_id", auth, async (req, res)=>{
    try{
        const comment =await Comment.findById(req.params.comment_id)
        if(!comment){
            res.status(404).send("Comment not found")
        }
        res.json(comment)
    }catch (e) {
        console.log(e)
    }

})

//Create comment
router.post("/", [
    auth,
    [
        body("text", "Text is required").not().isEmpty(),
    ]
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {
        username,
        profileImage,
        text
    } = req.body;

    const commentObj = {};
    commentObj.user = req.user.id;
    commentObj.username = username;
    commentObj.profileImage = profileImage
    if(text) commentObj.text = text;

    try {
        let comment = await new Comment(commentObj);
        await comment.save()
        console.log("Comment is created")

        const trip = await Trip.findById(req.params.id).populate("comments");
        trip.comments.unshift(comment);
        // console.log(trip)
        await trip.save()
        res.json(trip)
    }catch (e) {
        console.log(e)
        res.status(500).send("Server error")
    }

})


//Edit comment
router.put("/:comment_id", [
    auth,
    [
        body("text", "Text is required").not().isEmpty()
    ],
    async (req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        try {
            let comment =await Comment.findByIdAndUpdate(req.params.comment_id, req.body, {new: true});
            console.log("Comment is updated")

            const trip = await Trip.findById(req.params.id).populate("comments");
            await trip.save()
            res.json(trip)
        }catch (e) {
            console.log(e.message)
            res.status(500).send("Server error")
        }
    }
])

//Delete comment
router.delete("/:comment_id", auth, async (req, res)=>{
    try {
        await Comment.findByIdAndRemove(req.params.comment_id);
        console.log("Comment is deleted")
        const trip = await Trip.findById(req.params.id).populate("comments");
        await trip.save()
        res.json(trip)
    }catch (e) {
        console.log(e.message)
        res.status(500).send("Server error")
    }
})

//Create like
router.put("/:comment_id/like", auth, async (req, res)=>{
    try {
        let comment = await Comment.findById(req.params.comment_id);
        if(comment.likes.filter(like => like.user.toString()===req.user.id).length > 0){
            let removeIndex = comment.likes.map(like => like.user.toString()).indexOf(req.user.id);
            comment.likes.splice(removeIndex, 1)
        } else {
            comment.likes.unshift({user: req.user.id});
        }
        await comment.save();
        console.log("Liked is created")

        const trip = await Trip.findById(req.params.id).populate("comments");
        // trip.comments.unshift(comment);
        // console.log(trip)
        await trip.save()
        res.json(trip)

    }catch (e) {
        console.log(e.message)
        res.status(500).send("Server error")
    }
})


//Create reply
router.put("/:comment_id/reply", [
    auth,
    [
        body("text", "Text is required").not().isEmpty()
    ],
    async (req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {
            username,
            profileImage,
            text
        } = req.body;

        const replyObj = {
            username,
            profileImage,
            text
        };
        replyObj.user = req.user.id;

        try {
            const comment = await Comment.findById(req.params.comment_id);
            comment.replies.unshift(replyObj);
            await comment.save()

            const trip = await Trip.findById(req.params.id).populate("comments");
            res.json(trip)
        }catch (e) {
            console.log(e)
            res.status(500).send("Server error")
        }
    }
])


//Delete reply
router.delete("/:comment_id/reply/:index", auth, async (req, res)=>{
    try{
        let comment = await Comment.findById(req.params.comment_id);
        const index = parseInt(req.params.index)
        console.log(index)
        comment.replies.splice(index,1)
        await comment.save();

        const trip = await Trip.findById(req.params.id).populate("comments");
        await trip.save()
        res.json(trip)
    }catch (e) {
        console.log(e)
        res.status(500).send("Server error")
    }
})



module.exports = router