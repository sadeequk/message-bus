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

async function connectRabbitMQ(config) {
  try {
    const connection = await amqp.connect(config.amqpUrl);
    const channel = await connection.createChannel();

    eventEmitter.channel = channel;
    console.log("✅ Connected to RabbitMQ");

    return eventEmitter;
  } catch (error) {
    console.error("❌ RabbitMQ connection error:", error);
    throw error;
  }
}

function publishEvent(eventName, payload) {
  if (!eventEmitter.channel) {
    console.error("❌ Channel not initialized");
    return;
  }

  eventEmitter.channel.publish(
    "", // default exchange
    Buffer.from(eventName),
    Buffer.from(JSON.stringify(payload))
  );

  console.log(`📤 Published event: ${eventName}`);
}

function subscribeToEvent(eventName, handler) {
  eventEmitter.on(eventName, handler);
}

module.exports = {
  connectRabbitMQ,
  publishEvent,
  subscribeToEvent,
  eventEmitter,
};
