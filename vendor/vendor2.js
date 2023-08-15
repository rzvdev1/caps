'use strict ';
const { io } = require('socket.io-client');
const client = io('ws://localhost:3000');

const { chance, events } = require('../events.js');

let customer = `${chance.first()} ${chance.last()}`;
let address = `${chance.address()} ${chance.city()} ${chance.state()} ${chance.zip()}`;
let orderId = chance.guid();

function orderReady(client) {
  const order = {
    store: chance.store(),
    orderId: orderId,
    customer: customer,
    address: address,
    company: chance.company(),
  };
  const payload = {
    event: 'pickup',
    messageId: order.orderId,
    clientId: order.company,
    order: order,
  };
  console.log('Waiting Item For Pickup', order);
  client.emit(events.pickup, payload);
}

function success(payload, client) {
  console.log('VENDOR: Thank you for delivering', payload.messageId);
  client.emit('received', payload);
}

function vendorOperations() {
  console.log('Vendor Operations Started');
  client.emit('getAll', chance.company());
  client.on(events.delivered, (payload) => success(payload, client));
}

function start() {
  orderReady(client);
  setTimeout(() => {
    start();
  }, 5000);
}

module.exports = {
  vendorOperations,
  orderReady,
  success,
};
