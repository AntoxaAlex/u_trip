const express = require("express");
const router = express.Router({mergeParams: true});
const { body, validationResult} = require("express-validator");
const Post = require("../models/post");
const Trip = require("../models/trip");
const auth = require("../middleware/auth");

//Create post
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
        text,
        name,
        likes,
    } = req.body;

    const postObj = {
        text,
        name,
        likes
    };
    postObj.user = req.user.id;


    try {
        let post = await new Post(postObj);
        await post.save()
        console.log("Post is created")

        const trip = await Trip.findById(req.params.id);
        trip.posts.unshift(post);
        await trip.save()
        res.json(trip)
    }catch (e) {
        console.log(e)
        res.status(500).send("Server error")
    }

})


//Edit post
router.put("/:post_id", [
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
            let post =await Post.findByIdAndUpdate(req.params.post_id, req.body, {new: true});
            res.json(post);
            console.log("Post is updated")
        }catch (e) {
            console.log(e.message)
            res.status(500).send("Server error")
        }
    }
])

//Delete post
router.delete("/:post_id", auth, async (req, res)=>{
    try {
        await Post.findByIdAndRemove(req.params.post_id);
        res.send("Post is deleted")
    }catch (e) {
        console.log(e.message)
        res.status(500).send("Server error")
    }
})

//Create comments
router.put("/:post_id/comments", [
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
            text,
            name,
        } = req.body;

        const commentObj = {
            text,
            name
        };
        commentObj.user = req.user.id;

        try {
            const post = await Post.findById(req.params.post_id);
            post.comments.unshift(commentObj);
            await post.save()
            res.json(post)
        }catch (e) {
            console.log(e)
            res.status(500).send("Server error")
        }

    }
])

module.exports = router