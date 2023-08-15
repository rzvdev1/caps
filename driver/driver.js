'use strict ';
const { io } = require('socket.io-client');
const client = io('ws://localhost:3000');

const { chance, events } = require('../events.js');

function delivering(payload, client) {
  console.log('Driver is delivering order', payload.messageId);

  client.emit(events.delivered, payload);
  client.emit(events.ready);
}

function inTransit(payload, client) {
  console.log('Driver is in transit', payload.messageId);
  client.emit(events.inTransit, payload);
}

function pickup(payload, client) {
  console.log('Driver is picking up order', payload.messageId);
  inTransit(payload, client);
  setTimeout(() => {
    delivering(payload, client);
  }, 5000);
}

function start() {
  console.log('Driver is ready to pick up orders');
  client.emit(events.ready);
  client.on(events.pickup, (payload) => {
    pickup(payload, client);
  });
}
module.exports = { start };
