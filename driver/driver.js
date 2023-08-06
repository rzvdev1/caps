'use strict ';

const events = require('../eventPool.js');

events.on('pickup', driverPickup);
events.on('in-transit', driverInTransit);
events.on('delivered', driverDelivered);

function driverPickup(payload) {
  console.log('DRIVER :', 'picked up' + payload.orderId);
}

function driverInTransit(payload) {
  console.log('DRIVER :', 'in-transit' + payload);
}

function driverDelivered(payload) {
  console.log('DRIVER :', 'delivered' + payload);
}

events.emit('in-transit', {
  event: 'in-transit',
  payload: 'payload',
});
events.emit('delivered', { event: 'delivered', payload: 'payload' });
driverPickup();
driverInTransit();
driverDelivered();
