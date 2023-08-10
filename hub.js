'use strict';
const { Server } = require('socket.io');
const events = require('../caps/eventPool.js');

const io = new Server();

io.listen(3000);

const caps = io.of('/caps');
var Chance = require('chance');

// // Instantiate Chance so it can be used
let chance = new Chance();

let customer = `${chance.first()} ${chance.last()}`;
let address = `${chance.address()} ${chance.city()} ${chance.state()} ${chance.zip()}`;
let orderId = chance.guid();
let time = new Date().toISOString();
let store = chance.company();

function handlePickupReady(payload, socket) {
  console.log('the pickup was requested', payload.orderId);
  console.log('EVENT', { event: 'pickup', time: time, payload: payload });

  socket.emit('received', { message: 'pickup acknowledged' });

  caps.emit(events.ready, { message: 'a pickup is now ready', ...payload });
}

function pickup(payload) {
  console.log('the driver picked up the package', payload.orderId);
  caps.emit(events.pickedUp, payload);
}

function inTransit(payload) {
  caps.emit(events.inTransit, payload);
  console.log('EVENT', { event: 'in-transit', time: time, payload: orderId });
}

function delivered(payload) {
  console.log(`the package for ${payload.customerId} has been delivered`);
  caps.emit(events.delivered, {
    orderId: payload.orderId,
    message: `the package for ${payload.customerId} has been delivered`,
  });
  console.log('EVENT', { event: 'delivered', time: time, payload: orderId });
  console.log(`Thank you for your order ${customer}!`);
}

function handleConnection(socket) {
  console.log('we have a new connection: ', socket.id);

  socket.on(events.pickup, (payload) => handlePickupReady(payload, socket));
  socket.on(events.pickedUp, pickup);
  socket.on(events.inTransit, inTransit);
  socket.on(events.delivered, delivered);
}
function startSocketServer() {
  console.log('The server has been started');
  caps.on('connection', handleConnection);
}

module.exports = {
  startSocketServer,
  inTransit,
  delivered,
  io,
  caps,
};
