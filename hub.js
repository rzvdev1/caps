'use strict';
const { Server } = require('socket.io');
const events = require('../caps/eventPool.js');

const Queue = require('./vendor/vendor.js').Queue;

const io = new Server();

io.listen(3000);

const driverQueue = new Queue();
const packageQueue = new Queue();

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
  if (driverQueue.isEmpty()) {
    packageQueue.enqueue(socket);
  } else {
    let driver = driverQueue.dequeue();
    console.log('the pickup was requested', payload.orderId);
    console.log('EVENT', { event: 'pickup', time: time, payload: payload });

    driver.emit('received', { message: 'pickup acknowledged' });

    caps.emit(events.ready, { message: 'a pickup is now ready', ...payload });
    getAll(payload);
  }
}

function pickup(payload) {
  if (driverQueue.isEmpty()) {
    packageQueue.enqueue(payload);
  } else {
    let driver = driverQueue.dequeue();
    console.log('the driver picked up the package', payload.orderId);
    driver.emit(events.pickedUp, payload);
    received(payload);
  }
}

function inTransit(payload) {
  driverQueue.enqueue(payload);
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

function received(payload) {
  console.log('EVENT', { event: 'received', time: time, payload: orderId });
  caps.emit('received', payload);
}

function getAll(payload) {
  console.log('EVENT', { event: 'getAll', time: time, payload: orderId });
  caps.emit('getAll', payload);
}

module.exports = {
  startSocketServer,
  inTransit,
  delivered,
  io,
  caps,
  received,
};
