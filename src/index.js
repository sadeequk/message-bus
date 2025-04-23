// // src/index.js
// const { connectRabbitMQ, getChannel } = require("./config/rabbitmq");
// const { publishEvent } = require("../events/eventPublisher");
// const { subscribeToEvent } = require("../events/eventSubscriber");
// const EventEmitter = require("events");

// const eventEmitter = new EventEmitter();

// module.exports = {
//   connectRabbitMQ,
//   getChannel, // 👈 optional, useful if needed outside
//   publishEvent,
//   subscribeToEvent,
//   eventEmitter,
// };

// message-bus/src/index.js
// const { connectRabbitMQ } = require("./config/rabbitmq");
// const { publishEvent } = require("../events/eventPublisher");
// const { subscribeToEvent } = require("../events/eventSubscriber");
// const EventEmitter = require("events");

// const eventEmitter = new EventEmitter();

// module.exports = {
//   connectRabbitMQ,
//   publishEvent,
//   subscribeToEvent,
//   eventEmitter,
// };

// src/index.js
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
 * Publish event using RabbitMQ
 */
function publishEvent(eventName, payload) {
  if (!eventEmitter.channel) {
    console.error("❌ Cannot publish event: RabbitMQ channel is not initialized.");
    return;
  }

  try {
    eventEmitter.channel.assertQueue(eventName, { durable: false });
    eventEmitter.channel.sendToQueue(eventName, Buffer.from(JSON.stringify(payload)));
    console.log(`📤 Published event: ${eventName}`);
  } catch (err) {
    console.error("❌ Failed to publish event:", err);
  }
}

/**
 * Subscribe to custom EventEmitter (not RabbitMQ queues)
 */
function subscribeToEvent(eventName, handler) {
  eventEmitter.on(eventName, handler);
}

module.exports = {
  connectRabbitMQ,
  publishEvent,
  subscribeToEvent,
  eventEmitter,
};
