const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

const emailQueue = new Queue("email-process", { connection });

module.exports = emailQueue;
