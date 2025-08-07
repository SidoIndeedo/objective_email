const {Worker, QueueEvents} = require("bullmq");
const IORedis = require("ioredis");
const connection = require("./redisConnection");

require("dotenv").config();

//const connection = new IORedis({
//    host: process.env.REDIS_HOST || "redis",
//    port: process.env.PORT || 6379
//});

const emailWorker = new Worker("process-emails", async(job)=>{
	try{
		console.log(`job processing ${job.id}`);
		await new Promise((res) => setTimeout(res, 3000));
		console.log(`job completed ${job.id}`);

		return{status: "done"};
	} catch (err) {
		console.log(`${job.id} failed with error: `, err);
		throw err;
	}
}, {
	connection,
	concurrency: 5, //job running parallel
	removeOnComplete: {
		age: 60,
		count: 1000,
	},
	removeOnFail: {
		age: 600,
	},
	lockDuration: 30000 // prevents other worker from picking the job too quickly
	}

);


const queueEvents = new QueueEvents("email-queue", {connection});

queueEvents.on("completed", ({jobId}) => {
 	console.log(`job ${jobId} completed`);
});

queueEvents.on("failed", async ({jobId, failedReason}) => {
	console.log(`job ${jobId}, reason: ${failedReason}`);
	await handleJobFailure(jobId, failedReason);
});

queueEvents.on("stalled", ({jobId}) => {
	console.warn(`{jobId} stalled and will be retired`);
});


const shutdown = async () => {
	console.log("shuting down peacefully");
	await emailWorker.close();
	await queueEvents.close();
	process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);


