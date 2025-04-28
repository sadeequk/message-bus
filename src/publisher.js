const { getChannel } = require("./config/rabbitmq");
const config = require("../event.config");

async function publishEvent(eventName, payload) {
  const eventConfig = config[eventName];

  if (!eventConfig) {
    console.warn(`⚠️ No config found for event: ${eventName}`);
    return;
  }

  const { type, name } = eventConfig;
  const channel = getChannel();
  const message = Buffer.from(JSON.stringify(payload));

  try {
    if (type === "exchange") {
      await channel.assertExchange(name, "fanout", { durable: false });
      channel.publish(name, "", message);
      console.log(`📤 Published to exchange '${name}':`, payload);
    } else if (type === "queue") {
      await channel.assertQueue(name, { durable: false });
      channel.sendToQueue(name, message);
      console.log(`📤 Sent to queue '${name}':`, payload);
    }
  } catch (err) {
    console.error("❌ Failed to publish event:", err.message);
  }
}

module.exports = { publishEvent };
