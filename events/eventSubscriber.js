const { getChannel } = require("../config/rabbitmq");

async function subscribeToEvent(exchange, onMessage) {
  const channel = getChannel();
  await channel.assertExchange(exchange, "fanout", { durable: false });

  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, exchange, "");

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        const event = JSON.parse(msg.content.toString());
        onMessage(event);
      }
    },
    { noAck: true }
  );

  console.log(`[message-bus] Subscribed to ${exchange}`);
}

module.exports = { subscribeToEvent };
