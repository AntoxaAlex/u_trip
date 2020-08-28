const express = require("express");
const router = express.Router({mergeParams: true});
const { body, validationResult} = require("express-validator");
const User = require("../models/user");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config")


//Register user
router.post("/", [
    //name is required
    body("name","Name is required").not().isEmpty(),
    //username must be email
    body('email',"Please include a valid email").isEmail(),
    //min length of password must be 5
    body('password',"Please enter a password with 5 or more characters").isLength({min: 5})
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

        if(user){
            return res.status(400).json({errors: [{msg: "User already exists"}]})
        }

        //Create avatar
        const avatar = gravatar.url(email,{
            s: "200",
            r: "pg",
            d: "mm"
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        //Return jsonwebtoken

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

    }catch (e) {
        console.log(e.message)
    }

})

module.exports = router;