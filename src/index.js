//

const { connectRabbitMQ, getChannel } = require("./config/rabbitmq");
const { publishEvent } = require("./publisher");
const { subscribeToEvent } = require("../events/eventSubscriber");

module.exports = {
  connectRabbitMQ,
  publishEvent,
  subscribeToEvent,
  getChannel,
};
