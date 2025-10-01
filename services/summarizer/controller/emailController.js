// controllers/summarizer.js
import axios from "axios";
import pLimit from "p-limit";
import Email from "../models/Email.js"
import PendingSummary from "../models/PendingSummary.js";

const limit = pLimit(2); // max 2 parallel calls
const MODELS = ["llama-3.3-70b", "llama3.1-8b"]; // try bigger model first

async function callCerebras(prompt, model, retries = 3, delay = 1000) {
  try {
    const response = await axios.post(
      "https://api.cerebras.ai/v1/chat/completions",
      {
        model,
        messages: [
          { role: "system", content: "You are an email summarizer." },
          { role: "user", content: prompt }
        ],
        max_tokens: 256,
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    const status = err.response?.status;
    const isRateLimit = status === 429 || err.response?.data?.error?.includes("limit");

    if (isRateLimit && retries > 0) {
      console.warn(`⚠️ Rate limit on ${model}, retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
      return callCerebras(prompt, model, retries - 1, delay * 2);
    }

    throw err;
  }
}

export async function summarizeEmail(emailDoc) {
  return limit(async () => {
    try {
      const prompt = `
I have received an email regarding "${emailDoc.subject || "no subject"}". 
The email contains important points that need to be summarized in a very concise manner. 
The goal is to capture the essence of the email while using the fewest words possible. 

I want you to summarize the email into only one line, using no more than 50 words. 
Additionally, generate tags related to the email content, ensuring each tag is strictly one word. 

The outcome should be formatted exactly as follows:

[insert one-line summary]  
[insert one-word tags, separated by commas]  

Email:
From: ${emailDoc.from || ""}
Subject: ${emailDoc.subject || ""}
Body: ${emailDoc.body || emailDoc.summary || ""}
`;

      let aiText;
      for (const model of MODELS) {
        try {
          aiText = await callCerebras(prompt, model);
          console.log(`✅ Used model: ${model} for email ${emailDoc._id}`);
          break; // stop after first success
        } catch (err) {
          console.error(`❌ ${model} failed:`, err.response?.data || err.message);
          continue; // try next model
        }
      }

      if (!aiText) throw new Error("All models failed");

      // Extract tags (fallback crude split)
      let summary = aiText.trim();
      let tags = [];

      const tagMatch = aiText.match(/tags?:\s*(.*)/i);
      if (tagMatch) {
        tags = tagMatch[1]
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
        summary = aiText.replace(tagMatch[0], "").trim();
      } else if (aiText.includes("\n")) {
        // fallback if AI follows exact format
        const [line1, line2] = aiText.split("\n");
        summary = line1.trim();
        tags = line2 ? line2.split(",").map((t) => t.trim()) : [];
      }

      await Email.findByIdAndUpdate(emailDoc._id, {
        summary,
        tags,
        isProcessed: true,
        processedAt: new Date()
      });

      console.log(`📌 Summarized email saved: ${emailDoc._id}`);

      // cleanup if it was in retry queue
      await PendingSummary.deleteOne({ emailId: emailDoc._id });
    } catch (err) {
      console.error("🚨 Final summarization failed:", err.message);

      // push to retry queue
      await PendingSummary.findOneAndUpdate(
        { emailId: emailDoc._id },
        { $set: { lastTriedAt: new Date() }, $inc: { retryCount: 1 } },
        { upsert: true }
      );
    }
  });
}

// 🔄 Function for worker loop to retry failed emails
export async function retryPendingSummaries() {
  const pending = await PendingSummary.find().sort({ createdAt: 1 }).limit(3);

  for (const task of pending) {
    const email = await Email.findById(task.emailId);
    if (!email) {
      await PendingSummary.deleteOne({ _id: task._id }); // cleanup
      continue;
    }

    console.log(`🔄 Retrying email ${email._id} (attempt ${task.retryCount + 1})`);
    await summarizeEmail(email);
  }
}
