module.exports = {
  "user.microsoftAuthenticated": {
    type: "exchange",
    name: "user.events", //  "channel"
    subscribers: ["Audit-Service"],
  },
  "user.created": {
    type: "queue",
    name: "user.created.queue", // 1:1 "channel"
    subscribers: ["Email-Service"],
  },
  "invoice.created": {
    type: "exchange",
    name: "invoice.events",
    subscribers: ["Accounting-Service"],
  },
};
