// const { getChannel } = require("../src/config/rabbitmq");

// async function subscribeToEvent(exchange, onMessage) {
//   const channel = getChannel();
//   await channel.assertExchange(exchange, "fanout", { durable: false });

//   const q = await channel.assertQueue("", { exclusive: true });
//   await channel.bindQueue(q.queue, exchange, "");

//   channel.consume(
//     q.queue,
//     (msg) => {
//       if (msg.content) {
//         const event = JSON.parse(msg.content.toString());
//         onMessage(event);
//       }
//     },
//     { noAck: true }
//   );

//   console.log(`[message-bus] Subscribed to ${exchange}`);
// }

// module.exports = { subscribeToEvent };
// const { eventEmitter } = require("../src/index"); // make sure path is correct

// async function subscribeToEvent(eventName, onMessage) {
//   const channel = eventEmitter.channel;

//   if (!channel) {
//     throw new Error("RabbitMQ channel not initialized");
//   }

//   await channel.assertQueue(eventName, { durable: false });
//   await channel.consume(
//     eventName,
//     (msg) => {
//       if (msg.content) {
//         const data = JSON.parse(msg.content.toString());
//         onMessage(data);
//       }
//     },
//     { noAck: true }
//   );

//   console.log(`[message-bus] Subscribed to ${eventName}`);
// }

// module.exports = { subscribeToEvent };
