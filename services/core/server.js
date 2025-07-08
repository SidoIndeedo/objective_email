const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const emailRouter = require("./Routes/fetchEmail");
const app = express();

const port = 5001 || process.env.port;

// mongoose.connect(process.env.MONGO_URI).then(con => {
//     console.log(con);
//     console.log("db connected successfully")
// })


app.listen(port, () =>{
    console.log("core service running on internal 5001 and external 5002")
})


app.use("/v1", emailRouter)