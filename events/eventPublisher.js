const { getChannel } = require("../config/rabbitmq");

async function publishEvent(exchange, event) {
  const channel = getChannel();
  await channel.assertExchange(exchange, "fanout", { durable: false });

  channel.publish(exchange, "", Buffer.from(JSON.stringify(event)));
  console.log(`[message-bus] Published ${event.type}`);
}

module.exports = { publishEvent };
