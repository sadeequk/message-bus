function publishEvent(eventName, payload) {
  if (!module.exports.eventEmitter?.channel) {
    console.error("❌ Channel not initialized");
    return;
  }

  module.exports.eventEmitter.channel.publish(
    "", // default exchange
    eventName,
    Buffer.from(JSON.stringify(payload))
  );

  console.log(`📤 Event published: ${eventName}`);
}

module.exports = {
  publishEvent,
  setEventEmitter: (emitter) => {
    module.exports.eventEmitter = emitter;
  },
};
