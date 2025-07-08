// models/Email.js
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // from JWT
    required: true,
    ref: 'User' // purely for readability, this model won't exist in core
  },
  emailId: String,             // Gmail message ID (if you use it)
  from: String,
  to: [String],
  subject: String,
  body: String,                // (optional — you may store summary only)
  summary: String,             // Encrypted one-liner
  tag: String,                 // e.g. "Work", "Reminder"
  isImportant: Boolean,

  // Optional encryption metadata
  iv: String,

  // Metadata
  receivedAt: Date,
  processedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Email', emailSchema);
