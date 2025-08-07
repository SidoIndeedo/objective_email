const express = require("express");
const catchAsync = require("../utils/catchAsync");
const { google } = require("googleapis");
const emailQueue = require("../utils/emailQueue");

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

//   const  emailSummaries =  emailDetails.map(mailData => {
//     const headers = mailData.data.payload.headers;
//     const subject = headers.find(h => h.name === "Subject")?.value || "(No Subject)";
//     const from = headers.find(h => h.name === "From")?.value || "(Unknown Sender)";
//     const date = headers.find(h => h.name === "Date")?.value || "(No Date)";

  
//     let body = "";
//     const parts = mailData.data.payload.parts || [];

//     for (const part of parts) {
//       if (part.mimeType === "text/plain" && part.body?.data) {
//         body = Buffer.from(part.body.data, "base64").toString("utf8");
//         break;
//       }
//     }
//  emailQueue.add("process-emails", {emails: payloads}) //producer
//     return { subject, from, date, body };
//   });

const emailSummaries = await Promise.all(
  emailDetails.map(async (mailData) => {
    const headers = mailData.data.payload.headers;
    const subject = headers.find(h => h.name === "Subject")?.value || "(No Subject)";
    const from = headers.find(h => h.name === "From")?.value || "(Unknown Sender)";
    const date = headers.find(h => h.name === "Date")?.value || "(No Date)";

    let body = "";
    const parts = mailData.data.payload.parts || [];

    for (const part of parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        body = Buffer.from(part.body.data, "base64").toString("utf8");
        break;
      }
    }

    const payload = { subject, from, date, body };

    catchAsync(emailQueue.add("process-emails", payload));

    return payload;
  })
);


  
  
  res.status(202).json({ status: "email queued for processing" });

});
