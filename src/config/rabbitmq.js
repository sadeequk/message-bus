const amqplib = require("amqplib");

let channel;

async function connectRabbitMQ({
  amqpUrl = process.env.RABBITMQ_URL || "amqp://localhost",
  retryAttempts = 10,
  retryDelay = 3000,
} = {}) {
  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      const connection = await amqplib.connect(amqpUrl);
      channel = await connection.createChannel();
      console.log("✅ [message-bus] Connected to RabbitMQ");
      return;
    } catch (err) {
      console.error(`❌ [message-bus] RabbitMQ connection failed (Attempt ${attempt}):`, err.message);
      if (attempt === retryAttempts) {
        console.error("💥 All RabbitMQ connection attempts failed. Exiting...");
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, retryDelay));
    }
  }
}

function getChannel() {
  if (!channel) {
    throw new Error("❌ RabbitMQ channel not initialized");
  }
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };
