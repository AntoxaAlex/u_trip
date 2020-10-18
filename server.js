const express = require("express");
const app = express();
const config = require("config");
const connectDB = require("./config/db")
const cors = require("cors");
const bodyParser = require("body-parser");



//Environment variables
const port = config.get("PORT") || 4000;

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

//Set up data base
connectDB();
//Listening
app.listen(port,()=>{
    console.log("Server has been run on port: "+port)
})