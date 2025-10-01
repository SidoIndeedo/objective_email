import mongoose from "mongoose";

const PendingSummarySchema = new mongoose.Schema({
  emailId: { type: mongoose.Schema.Types.ObjectId, ref: "Email", required: true },
  retryCount: { type: Number, default: 0 },
  lastTriedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("PendingSummary", PendingSummarySchema);
