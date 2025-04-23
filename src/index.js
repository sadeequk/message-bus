const EventEmitter = require("events");
const amqp = require("amqplib");

const eventEmitter = new EventEmitter();

/**
 * Connect to RabbitMQ with retries
 */
async function connectRabbitMQ(config) {
  const { amqpUrl = "amqp://localhost", retryAttempts = 10, retryDelay = 5000 } = config;

  let attempts = 0;

  while (attempts < retryAttempts) {
    try {
      const connection = await amqp.connect(amqpUrl);
      const channel = await connection.createChannel();
      eventEmitter.channel = channel;

      console.log("✅ Connected to RabbitMQ");
      return eventEmitter;
    } catch (error) {
      attempts++;
      console.error(`❌ RabbitMQ connection failed (Attempt ${attempts}/${retryAttempts}):`, error.message);

      if (attempts >= retryAttempts) {
        throw new Error("❌ Exceeded maximum retry attempts to connect to RabbitMQ");
      }

      await new Promise((res) => setTimeout(res, retryDelay));
    }
  }
}

/**
 * Publish event to a fanout exchange
 */
async function publishEvent(eventName, payload) {
  if (!eventEmitter.channel) {
    console.error("❌ Cannot publish event: RabbitMQ channel is not initialized.");
    return;
  }

  try {
    // Declare fanout exchange and publish message
    await eventEmitter.channel.assertExchange(eventName, "fanout", { durable: false });
    eventEmitter.channel.publish(eventName, "", Buffer.from(JSON.stringify(payload)));

    console.log(`📤 Published event to exchange '${eventName}':`, payload);
  } catch (err) {
    console.error("❌ Failed to publish event:", err);
  }
}

/**
 * Subscribe to a fanout exchange
 */
async function subscribeToEvent(exchange, handler) {
  if (!eventEmitter.channel) {
    throw new Error("RabbitMQ channel not initialized");
  }

  await eventEmitter.channel.assertExchange(exchange, "fanout", { durable: false });
  const q = await eventEmitter.channel.assertQueue("", { exclusive: true });
  await eventEmitter.channel.bindQueue(q.queue, exchange, "");

  eventEmitter.channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        const eventData = JSON.parse(msg.content.toString());
        handler(eventData);
      }
    },
    { noAck: true }
  );

  console.log(`[message-bus] Subscribed to fanout exchange: ${exchange}`);
}

module.exports = {
  connectRabbitMQ,
  publishEvent,
  subscribeToEvent,
  eventEmitter,
};
