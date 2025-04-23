const amqplib = require("amqplib");

let channel;

async function connectRabbitMQ(rabbitmqURL) {
  const connection = await amqplib.connect(rabbitmqURL);
  channel = await connection.createChannel();
  console.log("[message-bus] Connected to RabbitMQ");
}

function getChannel() {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };
