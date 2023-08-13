'use strict ';
const { io } = require('socket.io-client');
const client = io('ws://localhost:3000/caps');

const events = require('../eventPool.js');

var Chance = require('chance');

// Instantiate Chance so it can be used
let chance = new Chance();

let customer = `${chance.first()} ${chance.last()}`;
let address = `${chance.address()} ${chance.city()} ${chance.state()} ${chance.zip()}`;
let orderId = chance.guid();

class Queue {
  constructor() {
    this.queue = [];
  }
  // the driver queue will hold driver sockets
  // the package queue will hold payloads
  enqueue(item) {
    this.queue.unshift(item);
  }

  dequeue() {
    return this.queue.pop();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

const payload = {
  customerId: customer,
  orderId: orderId,
  address: address,
};
client.emit(events.pickup, payload);

client.on(events.announcement, (payload) => console.log(payload.message));
client.on(events.pickedUp, (payload) =>
  console.log('the package has been picked up by the driver', payload.orderId)
);
client.on(events.pickedUp, (payload) =>
  console.log('the package is in transit', payload.orderId)
);

client.on(events.delivered, (payload) =>
  console.log(payload.message, payload.orderId)
);
module.exports = { client, Queue };
