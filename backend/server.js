const express = require("express");
const app = express();
const config = require("config");
const connectDB = require("./config/db")


//Environment variables
const port = config.get("PORT") || 4000;

//Middleware
app.use(express.json({extended: false}));

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