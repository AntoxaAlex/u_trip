const jwt = require("jsonwebtoken");
const config = require("config")

module.exports = function (req, res, next) {
    //Get token from the header
    const token = req.header("x-auth-token");
    const secretKey = config.get("SECRET")

    //Check if no token
    if(!token){
        return res.status(401).json({msg: "No token, authorization denied"})
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded.user;
        next();
    }catch (e) {
        res.status(401).json({msg: "Token is not valid"})
    }
}