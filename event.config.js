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
  "lookuptype.created": {
    type: "exchange",
    name: "lookuptype.events",
    subscribers: ["Audit-Service"],
  },
  "lookuptype.updated": {
    type: "exchange",
    name: "lookuptype.events",
    subscribers: ["Audit-Service"],
  },
  "lookuptype.deleted": {
    type: "exchange",
    name: "lookuptype.events",
    subscribers: ["Audit-Service"],
  },
};
