const config = require("../event.config");

function getAllEvents() {
  const events = [];

  for (const [eventName, eventData] of Object.entries(config)) {
    events.push({
      eventName,
      type: eventData.type,
      channelName: eventData.name,
      subscribers: eventData.subscribers || [],
    });
  }

  return events;
}

module.exports = { getAllEvents };
