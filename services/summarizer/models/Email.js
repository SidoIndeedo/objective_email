const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  messageId: { type: String, required: true, unique: true },
  from: String,
  to: [String],
  subject: String,
  body: {type: String, default: ""},
  summary: { type: String, default: "" },
  tags: { type: [String], default: [] },
  isImportant: { type: Boolean, default: false },
  iv: String,
  receivedAt: Date,
  isProcessed: { type: Boolean, default: false },
  processedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Email', emailSchema);
