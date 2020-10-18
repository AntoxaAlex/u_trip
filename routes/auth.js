const express = require("express");
const router = express.Router({mergeParams: true});
const { body, validationResult} = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth")

router.get("/", auth, async (req, res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    }catch (e) {
        console.error(e.message);
    }
})

//Authenticate user and get token
router.post("/", [
    //username must be email
    body('email',"Please include a valid email").isEmail(),
    //password id required
    body('password',"Password id required").exists()
], async (req, res)=>{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

//    Retrieve values from body
    const { name, email, password} = req.body;
    try {
        //Check if user is already exists
        let user = await User.findOne({email});

        //Check user
        if(!user){
            return res.status(400).json({errors: [{msg: "Invalid Credentials"}]})
        }

      const isMatch = await bcrypt.compare(password, user.password);

        //Check password
        if(!isMatch){
            return res.status(400).json({errors: [{msg: "Invalid Credentials"}]})
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        const secretKey = config.get("SECRET")

        jwt.sign(payload,secretKey,{expiresIn: 360000},(err, token)=>{
            if(err) throw err;
            res.json({token})
        })

        console.log("User logged in")
    }catch (e) {
        console.log(e.message)
    }

})

module.exports = router;