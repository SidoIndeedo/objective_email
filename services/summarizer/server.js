// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Email from "./models/Email.js";
import { summarizeEmail, retryPendingSummaries } from "./controller/emailController.js";

dotenv.config();

const app = express();
app.use(express.json());

(async () => {
  await connectDB();

  console.log("🔎 Watching for new emails...");

  // MongoDB Change Stream -> new emails
  const changeStream = Email.watch([{ $match: { operationType: "insert" } }]);

  changeStream.on("change", async (change) => {
    const newEmail = change.fullDocument;
    console.log("🆕 New email detected:", newEmail._id);
    await summarizeEmail(newEmail);
  });

  // Retry loop for failed summaries (every 30s)
  setInterval(async () => {
    console.log("⏳ Checking for pending summaries...");
    await retryPendingSummaries();
  }, 30 * 1000);
})();

app.listen(process.env.PORT, () => {
  console.log(`📡 Summarizer service running on port ${process.env.PORT}`);
});
