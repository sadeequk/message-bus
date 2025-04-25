// message-bus/src/subscriber.js

const { getChannel } = require("./config/rabbitmq");
const config = require("../event.config");

async function subscribeToEvent(eventName, handler) {
  const eventConfig = config[eventName];

  if (!eventConfig) {
    console.warn(`⚠️ No config for event: ${eventName}`);
    return;
  }

  const { type, name } = eventConfig;
  const channel = getChannel();

  try {
    if (type === "exchange") {
      await channel.assertExchange(name, "fanout", { durable: false });
      const { queue } = await channel.assertQueue("", { exclusive: true });
      await channel.bindQueue(queue, name, "");
      channel.consume(
        queue,
        (msg) => {
          if (msg?.content) {
            handler(JSON.parse(msg.content.toString()));
          }
        },
        { noAck: true }
      );

      console.log(`✅ Subscribed to exchange '${name}' for event '${eventName}'`);
    } else if (type === "queue") {
      await channel.assertQueue(name, { durable: false });
      channel.consume(
        name,
        (msg) => {
          if (msg?.content) {
            handler(JSON.parse(msg.content.toString()));
          }
        },
        { noAck: true }
      );

      console.log(`✅ Subscribed to queue '${name}' for event '${eventName}'`);
    }
  } catch (err) {
    console.error("❌ Subscription error:", err.message);
  }
}

module.exports = { subscribeToEvent };
