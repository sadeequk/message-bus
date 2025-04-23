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
const { connectRabbitMQ } = require("./config/rabbitmq");
const { publishEvent } = require("../events/eventPublisher");
const { subscribeToEvent } = require("../events/eventSubscriber");
const EventEmitter = require("events");

const eventEmitter = new EventEmitter();

module.exports = {
  connectRabbitMQ,
  publishEvent,
  subscribeToEvent,
  eventEmitter, // ✅ Must export this!
};
