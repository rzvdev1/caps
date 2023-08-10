'use strict ';
const { io } = require('socket.io-client');
const events = require('../eventPool.js');

// events.emit('pickup', { event: 'pickup', payload: '1' });
// events.emit('in-transit', { event: 'in-transit', payload: '1' });
// events.emit('delivered', { event: 'delivered', payload: '1' });

const handleReady = (payload) => {
  console.log('The package is ready to be picked up');

  client.emit(events.inTransit, payload);

  console.log('the package has been delivered');
  client.emit(events.delivered, payload);
};

const client = io('ws://localhost:3000/caps');
client.on(events.announcement, (payload) => console.log(payload.message));
client.on(events.ready, handleReady);

module.exports = { client };
