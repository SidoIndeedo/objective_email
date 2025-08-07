// utils/event.js
const { QueueEvents } = require("bullmq");
const connection = require("./redisConnection");

const queueName = process.env.QUEUE_NAME || "process-emails";

const queueEvents = new QueueEvents(queueName, { connection });

queueEvents.on("completed", ({ jobId }) => {
  console.log(`✅ Job ${jobId} completed`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.error(`❌ Job ${jobId} failed: ${failedReason}`);
});

queueEvents.on("waiting", ({ jobId }) => {
  console.log(`⏳ Job ${jobId} is waiting in queue`);
});

module.exports = queueEvents;
