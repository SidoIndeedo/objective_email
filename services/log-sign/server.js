const express = require('express');
const mongoose = require('mongoose');
const connectDB = require("./db");
const passport = require('passport');
// const session = require('cookie-session');
const session = require('express-session');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
dotenv.config();
require('./passport');

const app = express();
connectDB();
app.set('trust proxy', true) //

mongoose.connect(process.env.MONGO_URI);

// app.use(
//   session({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [process.env.SESSION_SECRET],
//   })
// );

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Home Page');
});

app.listen(5000, () => {
  console.log(`log-sign service running on: 5000`);
});
