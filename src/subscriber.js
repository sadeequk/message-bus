// / const { getChannel } = require("./config/rabbitmq");
// const config = require("../event.config");

// async function subscribeToEvent(eventName, handler, subscriberId = "default-subscriber") {
//   const eventConfig = config[eventName];

//   if (!eventConfig) {
//     console.warn(`⚠️ No config for event: ${eventName}`);
//     return;
//   }

//   const { type, name } = eventConfig;
//   const channel = getChannel();

//   try {
//     if (type === "exchange") {
//       await channel.assertExchange(name, "fanout", { durable: false });

//       // ✅ Persistent queue named per service
//       const queueName = `${eventName}.${subscriberId}`;
//       await channel.assertQueue(queueName, { durable: true });
//       await channel.bindQueue(queueName, name, "");

//       channel.consume(
//         queueName,
//         (msg) => {
//           if (msg?.content) {
//             handler(JSON.parse(msg.content.toString()));
//           }
//         },
//         { noAck: true }
//       );

//       console.log(`✅ Subscribed '${subscriberId}' to exchange '${name}' for event '${eventName}'`);
//     } else if (type === "queue") {
//       await channel.assertQueue(name, { durable: false });

//       channel.consume(
//         name,
//         (msg) => {
//           if (msg?.content) {
//             handler(JSON.parse(msg.content.toString()));
//           }
//         },
//         { noAck: true }
//       );

//       console.log(`✅ Subscribed to queue '${name}' for event '${eventName}'`);
//     }
//   } catch (err) {
//     console.error("❌ Subscription error:", err.message);
//   }
// }

// module.exports = { subscribeToEvent };

const { getChannel } = require("./config/rabbitmq");
const config = require("../event.config");

async function subscribeToEvent(eventName, handler, subscriberId = "default-subscriber") {
  const eventConfig = config[eventName];

  if (!eventConfig) {
    console.warn(`⚠️ No config for event: ${eventName}`);
    return;
  }

  const { type, name } = eventConfig;
  const channel = getChannel();

  try {
    if (type === "exchange") {
      // Keep exchange as non-durable to match existing configuration
      await channel.assertExchange(name, "fanout", { durable: false });

      // Create a durable queue without TTL to match existing configuration
      const queueName = `${eventName}.${subscriberId}`;
      await channel.assertQueue(queueName, {
        durable: true,
      });
      await channel.bindQueue(queueName, name, "");

      // Set prefetch to 1 to ensure fair distribution
      await channel.prefetch(1);

      channel.consume(
        queueName,
        async (msg) => {
          if (msg?.content) {
            try {
              const data = JSON.parse(msg.content.toString());
              await handler(data);
              // Acknowledge message only after successful processing
              channel.ack(msg);
            } catch (error) {
              console.error(`❌ Error processing message for ${eventName}:`, error);
              // Reject message and requeue if processing fails
              channel.nack(msg, false, true);
            }
          }
        },
        { noAck: false } // Set to false to enable manual acknowledgment
      );

      console.log(`✅ Subscribed '${subscriberId}' to exchange '${name}' for event '${eventName}'`);
    } else if (type === "queue") {
      await channel.assertQueue(name, { durable: true });
      await channel.prefetch(1);

      channel.consume(
        name,
        async (msg) => {
          if (msg?.content) {
            try {
              const data = JSON.parse(msg.content.toString());
              await handler(data);
              channel.ack(msg);
            } catch (error) {
              console.error(`❌ Error processing message for ${eventName}:`, error);
              channel.nack(msg, false, true);
            }
          }
        },
        { noAck: false }
      );

      console.log(`✅ Subscribed to queue '${name}' for event '${eventName}'`);
    }
  } catch (err) {
    console.error("❌ Subscription error:", err.message);
  }
}

module.exports = { subscribeToEvent };
