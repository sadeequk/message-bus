//

// message-bus/index.js
const { connectRabbitMQ, getChannel } = require("./config/rabbitmq");
const { publishEvent } = require("./publisher");
const { subscribeToEvent } = require("./subscriber"); // <== This must be included

module.exports = {
  connectRabbitMQ,
  publishEvent,
  subscribeToEvent,
  getChannel,
};
