const mongoose = require("mongoose");
const slugify = require('slugify');
const validator = require('validator'); 
const bcrypt = require('bcrypt'); 
const crypto = require('crypto');
const { type } = require("os");

const userSchema = new mongoose.Schema({
  displayName : {
    type: String,
    required: [true, 'User name is required'],
    unique: false
  },

  googleId: {
  type: String,
  required: true,
  unique: true
},


  email :{
    type: String,
    required : [true, 'Your email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']  
  },

  photo :{
    type: String,
    required : false
  },

  role : {
    type: String,
    enum: ['user', 'admin', 'tech', 'tester'],
    default: 'user'
  },

  loginAt: {
    type: String,
    required: true
  },

  ipAddress : {
    type: String,
    required: true
  },

  userAgent: {
    type: String,
    required: true
  },

  os: {
    type: String,
    required: true
  },

  browser: {
    type: String,
    required: true
  },

  device: String,

  location: {
    city: String,
    region: String,
    country: String,
  },

 
  gmailAccessToken: {
    type: String,
    required: false //for failed logins
  }

});

module.exports = mongoose.model('User', userSchema);
