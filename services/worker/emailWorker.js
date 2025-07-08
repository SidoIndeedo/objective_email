const {Worker} = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
    host: "localhost",
    port: 6379
});

const emailWorker = new Worker("email-queue", async (job) => {
    const {emails, userId} = job.data;
    
})