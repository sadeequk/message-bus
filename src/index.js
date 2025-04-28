const { connectRabbitMQ, getChannel } = require("./config/rabbitmq");
const { publishEvent } = require("./publisher");
const { subscribeToEvent } = require("./subscriber");
const { getAllEvents } = require("./events.info");
module.exports = {
  connectRabbitMQ,
  publishEvent,
  subscribeToEvent,
  getChannel,
  getAllEvents,
};
