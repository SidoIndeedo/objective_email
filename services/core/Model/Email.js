// models/Email.js
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // link to logged-in user (from JWT)
    required: true,
    ref: 'User' // purely for readability, actual User model lives in log-sign
  },

  messageId: {                     // Gmail's unique message ID
    type: String,
    required: true,
    unique: true
  },

  from: { type: String },
  to: [String],
  subject: { type: String },
  body: { type: String },          // full email body (optional, can skip)
  
  // Processing fields
  summary: { type: String, default: "" },  
tags: {
  type: [String],
  default: []
},
  isImportant: { type: Boolean, default: false },

  // Optional encryption metadata
  iv: { type: String },

  // Metadata
  receivedAt: { type: Date },
  isProcessed: {type: Boolean, default: false},
  processedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Email', emailSchema);
