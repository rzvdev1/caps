'use strict ';
const { io } = require('socket.io-client');
const client = io('ws://localhost:3000/caps');

const events = require('../eventPool.js');

// var Chance = require('chance');

// // Instantiate Chance so it can be used
// let chance = new Chance();

// let customer = `${chance.first()} ${chance.last()}`;
// let address = `${chance.address()} ${chance.city()} ${chance.state()} ${chance.zip()}`;
// let orderId = chance.guid();
// let time = new Date().toISOString();
// let store = chance.company();

// events.on('pickup', pickup);
// events.on('in-transit', inTransit);
// events.on('delivered', delivered);

// function pickup() {
//   let payload = {
//     store: store,
//     orderId: orderId,
//     customer: customer,
//     address: address,
//   };
//   console.log('EVENT', { event: 'pickup', time: time, payload: payload });
// }

// function inTransit() {
//   console.log('EVENT', { event: 'in-transit', time: time, payload: orderId });
// }

// function delivered() {
//   console.log('EVENT', { event: 'delivered', time: time, payload: orderId });
//   console.log(`Thank you for your order ${customer}!`);
// }
var Chance = require('chance');

// Instantiate Chance so it can be used
let chance = new Chance();

let customer = `${chance.first()} ${chance.last()}`;
let address = `${chance.address()} ${chance.city()} ${chance.state()} ${chance.zip()}`;
let orderId = chance.guid();

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
module.exports = { client };
