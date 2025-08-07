const { Queue } = require("bullmq");
const IORedis = require("ioredis");
require("dotenv").config()
// console.log(process.env.REDIS_QUEUE_NAME)


const connection = new IORedis({
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: 2,
  reconnectOnError(err) {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      console.log("⚠️ Redis reconnecting due to READONLY error");
      return true;
    }
    return false;
  },
  retryStrategy(times) {
    const delay = Math.min(times * 50, 5000);
    console.log(`⏳ Redis retry in ${delay}ms`);
    return delay;
  },
});


const emailQueue = new Queue("email-process", { connection });

module.exports = {emailQueue, connection};
