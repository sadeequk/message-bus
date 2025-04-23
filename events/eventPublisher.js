// function publishEvent(eventName, payload) {
//   if (!module.exports.eventEmitter?.channel) {
//     console.error("❌ Channel not initialized");
//     return;
//   }

//   module.exports.eventEmitter.channel.publish(
//     "", // default exchange
//     eventName,
//     Buffer.from(JSON.stringify(payload))
//   );

//   console.log(`📤 Event published: ${eventName}`);
// }

// module.exports = {
//   publishEvent,
//   setEventEmitter: (emitter) => {
//     module.exports.eventEmitter = emitter;
//   },
// };

async function publishEvent(eventName, payload) {
  if (!eventEmitter.channel) {
    console.error("❌ Cannot publish event: RabbitMQ channel is not initialized.");
    return;
  }

  try {
    const exchange = eventName; // use eventName as exchange
    await eventEmitter.channel.assertExchange(exchange, "fanout", { durable: false });
    eventEmitter.channel.publish(exchange, "", Buffer.from(JSON.stringify(payload)));
    console.log(`📤 Published event to exchange '${exchange}':`, payload);
  } catch (err) {
    console.error("❌ Failed to publish event:", err);
  }
}
