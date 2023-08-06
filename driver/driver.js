'use strict ';

const events = require('../eventPool.js');

events.emit('pickup', { event: 'pickup', payload: '1' });
events.emit('in-transit', { event: 'in-transit', payload: '1' });
events.emit('delivered', { event: 'delivered', payload: '1' });
