// controllers/emailController.js
const mongoose = require("mongoose");
const { google } = require("googleapis");
const Email = require("../Model/Email");
const catchAsync = require("../utils/catchAsync");

exports.all = catchAsync(async (req, res) => {
  const accessToken = req.user.accessToken;

  const oauth2client = new google.auth.OAuth2();
  oauth2client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2client });

  const darkList = await gmail.users.messages.list({
    userId: "me",
    maxResults: 5,
  });

  const mails = darkList.data.messages || [];

  const emailDetails = await Promise.all(
    mails.map(mail =>
      gmail.users.messages.get({
        userId: "me",
        id: mail.id,
        format: "full",
      })
    )
  );

  let inserted = 0;
  let failed = 0;

  for (const detail of emailDetails) {
    try {
      const payload = detail.data.payload || {};
      const headers = payload.headers || [];

      const from = headers.find(h => h.name === "From")?.value || "";
      const to = headers.find(h => h.name === "To")?.value?.split(",") || [];
      const subject = headers.find(h => h.name === "Subject")?.value || "";

     await Email.findOneAndUpdate(
  { messageId: detail.data.id, user: req.user.userId },
  {
    $setOnInsert: {   // ✅ only set these if document is new
      user: req.user.userId,
      messageId: detail.data.id,
      from,
      to,
      subject,
      summary: "",        // no summary yet
      tags: [],
      isImportant: false,
      receivedAt: new Date(parseInt(detail.data.internalDate)),
      isProcessed: false,
      processedAt: null
    }
  },
  { new: true, upsert: true, runValidators: true }
);


      inserted++;
    } catch (err) {
      failed++;
      console.error("❌ Failed to save email:", err.message);
    }
  }

  if (failed > 0 && inserted === 0) {
    return res.status(500).json({
      status: "error",
      message: "Failed to store any emails",
    });
  }

  return res.status(201).json({
    status: "emails stored",
    inserted,
    failed,
    totalFetched: mails.length,
  });
});

exports.deleteEmail = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email ID format",
    });
  }

  const deletedEmail = await Email.findByIdAndDelete(id);

  if (!deletedEmail) {
    return res.status(404).json({
      status: "error",
      message: "Email not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Email deleted successfully",
    deletedId: id,
  });
});

exports.deleteAllEmailsForUser = catchAsync(async (req, res) => {
  const userId = req.user.userId; // pulled from JWT

  // Delete all emails for this user
  const result = await Email.deleteMany({ user: userId });

  res.status(200).json({
    status: "success",
    message: "All emails deleted for this user",
    deletedCount: result.deletedCount,
  });
});
