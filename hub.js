'use strict';
const { Server } = require('socket.io');
const { events, Queue, chance } = require('./events');

const io = new Server();

io.listen(3000);

const driverQueue = new Queue();
const packageQueue = new Queue();

let chanceOneSocket = null;
let chanceTwoSocket = null;
const chanceOneDeliveredQueue = new Queue();
const chanceTwoDeliveredQueue = new Queue();

function handlePickupReady(payload) {
  console.log('Pending pickup', payload.orderId);
  if (driverQueue.isEmpty()) {
    packageQueue.enqueue(payload);
  } else {
    let driver = driverQueue.dequeue();
    driver.emit(events.pickup, payload);
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
  console.log('in transit', payload.orderId);
  if (payload.clientId === chance.guid()) {
    chanceOneSocket.emit(events.inTransit, payload);
  }
  if (payload.clientId === chance.chance.guid()) {
    chanceTwoSocket.emit(events.inTransit, payload);
  }
}

function ready(socket) {
  if (packageQueue.isEmpty()) {
    driverQueue.enqueue(socket);
  } else {
    let order = packageQueue.dequeue();
    console.log('the driver picked up the package', order.orderId);
    socket.emit(events.pickup, order);
  }
}

function delivered(payload) {
  console.log('delivered', payload.orderId);
  if (payload.clientId === chance.guid()) {
    chanceOneDeliveredQueue.enqueue(payload);
    chanceOneSocket.emit(events.delivered, payload);
  }
  if (payload.clientId === chance.chance.guid()) {
    chanceTwoDeliveredQueue.enqueue(payload);
    chanceTwoSocket.emit(events.delivered, payload);
  }
}

function handleConnection(socket) {
  console.log('we have a new connection: ', socket.id);

  socket.on(events.pickup, handlePickupReady);
  socket.on(events.ready, (payload) => {
    ready(socket);
  });

  socket.on(events.delivered, delivered);
  socket.on('received', received);
  socket.on('getAll', (params) => getAll(params, socket));
}

function startSocketServer() {
  // on connection has a payload of the socket that connected
  io.on('connection', handleConnection);
  console.log('Everything is started!');
}

function received(payload) {
  console.log('vendor acknowledged delivery', payload.messageId);
  // remove from the queue
  if (payload.clientId === chance.guid()) {
    // put it in the 1-800-flowers queue
    chanceOneDeliveredQueue.dequeue();
  }
  if (payload.clientId === chance.chance.guid()) {
    // put it in acme queue
    chanceTwoDeliveredQueue.dequeue();
  }
}

function getAll(params, socket) {
  if (params === chance.company()) {
    chanceOneSocket = socket;
    chanceOneDeliveredQueue.queue.forEach((order) => {
      socket.emit(events.delivered, order);
    });
  } else if (params === chance.chance.company()) {
    chanceTwoSocket = socket;
    chanceOneDeliveredQueue.queue.forEach((order) => {
      socket.emit(events.delivered, order);
    });
  }
}

module.exports = {
  startSocketServer,
  inTransit,
  delivered,
  io,
  pickup,
  received,
  handleConnection,
};
