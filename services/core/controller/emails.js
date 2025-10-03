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

  const maxResults = parseInt(req.query.limit, 10) || 5;

  const messageList = await gmail.users.messages.list({
    userId: "me",
    maxResults,
  });

  const mails = messageList.data.messages || [];
  if (mails.length === 0) {
    return res.status(200).json({
      status: "ok",
      message: "No emails found",
      inserted: 0,
      failed: 0,
      totalFetched: 0,
    });
  }

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

      // ✅ extract body cleanly
      let body = "";
      if (payload.parts) {
        // Look for plain text first
        const textPart = payload.parts.find(p => p.mimeType === "text/plain");
        const htmlPart = payload.parts.find(p => p.mimeType === "text/html");

        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, "base64").toString("utf-8");
        } else if (htmlPart?.body?.data) {
          const html = Buffer.from(htmlPart.body.data, "base64").toString("utf-8");
          body = convert(html, { wordwrap: false }); // ✅ strip HTML
        }
      } else if (payload.body?.data) {
        body = Buffer.from(payload.body.data, "base64").toString("utf-8");
      }

      await Email.findOneAndUpdate(
        { messageId: detail.data.id, user: req.user.userId },
        {
          $setOnInsert: {
            user: req.user.userId,
            messageId: detail.data.id,
            from,
            to,
            subject,
            body, // ✅ now always plain text
            summary: "",
            tags: [],
            isImportant: false,
            receivedAt: new Date(parseInt(detail.data.internalDate)),
            isProcessed: false,
            processedAt: null,
          },
        },
        { new: true, upsert: true, runValidators: true }
      );

      inserted++;
    } catch (err) {
      failed++;
      console.error("❌ Failed to save email:", err.message);
    }
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


// ✅ Get all emails for the logged-in user
exports.getAllEmails = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  // pagination support
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // fetch emails for this user
  const emails = await Email.find({ user: userId })
    .sort({ receivedAt: -1 }) // latest first
    .skip(skip)
    .limit(limit)
    .lean();

  const totalEmails = await Email.countDocuments({ user: userId });
  const totalPages = Math.ceil(totalEmails / limit);

  res.status(200).json({
    status: "success",
    results: emails.length,
    page,
    totalPages,
    totalEmails,
    emails,
  });
});


