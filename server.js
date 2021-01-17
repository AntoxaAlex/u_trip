const express = require("express");
const app = express();
const config = require("config");
const connectDB = require("./config/db")
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path")



//Environment variables
const port = process.env.PORT || 4000;

//Middleware
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(bodyParser.json({limit: "50mb", extended: true}))
app.use(cors());

//Defile routes
app.use("/trips",require("./routes/trips"));
app.use("/auth",require("./routes/auth"));
app.use("/profile",require("./routes/profile"));
app.use("/user", require("./routes/user"));
app.use("/trips/show/:id/posts", require("./routes/posts"));
app.use("/search", require("./routes/search"));

//Set up data base
connectDB();

//Serve static assets in production
if(process.env.NODE_ENV === "production"){
    //Set static folder
    app.use(express.static("client/build"));

    app.get("*", (req,res)=>{
        res.sendFile(path.resolve(__dirname,"client", "build", "index.html"))
    })
}

//Listening
app.listen(port,()=>{
    console.log("Server has been run on port: "+port)
})