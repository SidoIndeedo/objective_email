require("dotenv").config();
const IORedis = require("ioredis");
const dns = require("dns").promises;

let connection;

async function initRedisConnection() {
  try {
    const { address } = await dns.lookup("redis");
    console.log("🔧 RESOLVED REDIS IP:", address);

    connection = new IORedis({
      host: address,
      port: 6379,
      maxRetriesPerRequest: 2,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        console.log(`⏳ Redis retry in ${delay}ms`);
        return delay;
      },
      reconnectOnError(err) {
        if (err.message.includes("READONLY")) {
          console.log("⚠️ Redis reconnecting due to READONLY error");
          return true;
        }
        return false;
      },
    });

    // Attach listeners after connection is initialized
    connection.on("connect", () => console.log("✅ Redis client connected"));
    connection.on("ready", () => console.log("✅ Redis client is ready"));
    connection.on("error", (err) => console.log("❌ Redis error:", err));
    connection.on("close", () => console.log("🔌 Redis connection closed"));
    connection.on("reconnecting", () => console.log("🔁 Redis reconnecting..."));

    // Just a test ping — optional
    connection.ping().then((res) => console.log("🏓 Redis ping response:", res));
  } catch (err) {
    console.error("❌ Failed to initialize Redis:", err);
  }
}

initRedisConnection();

module.exports = {
  get connection() {
    return connection;
  },
};
