const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const emailRouter = require("./Routes/fetchEmail");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());  
app.use(cookieParser());

const port = process.env.PORT || 5001;

// === Connect to MongoDB ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error("DB connection error:", err));

// === Middlewares ===
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true,               // allow cookies/auth headers
}));
         // parse JSON bodies

// === Routes ===
app.use("/v1", emailRouter);

// === Start Server ===
app.listen(port, () => {
  console.log(`Core service running on port ${port}`);
});
