'use strict ';

const events = require('../eventPool.js');

var Chance = require('chance');

// Instantiate Chance so it can be used
let chance = new Chance();

let customer = `${chance.first()} ${chance.last()}`;
let address = `${chance.address()} ${chance.city()} ${chance.state()} ${chance.zip()}`;
let orderId = chance.guid();
let time = new Date().toISOString();
let store = chance.company();

events.on('pickup', pickup);
events.on('delivered', delivered);

function pickup() {
  let payload = {
    store: store,
    orderId: orderId,
    customer: customer,
    address: address,
  };
  console.log('EVENT', { event: 'pickup', time: time, payload: payload });
}

function delivered() {
  console.log(`Thank you for your order ${customer}!`);
}

module.exports = { pickup, delivered };
