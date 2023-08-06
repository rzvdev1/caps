'use strict';

const { it } = require('node:test');
const { pickup, inTransit, delivered } = require('../vendor/vendor.js');
const { describe } = require('yargs');

// 'use strict ';

// const events = require('../eventPool.js');

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

// module.exports = { pickup, inTransit, delivered };

describe('Testing the vendor module', () => {
  it('should log a thank you message when delivered', () => {
    let consoleSpy = jest.spyOn(console, 'log');
    delivered();
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should log an order pickup message when picked up', () => {
    let consoleSpy = jest.spyOn(console, 'log');
    pickup();
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should log an order in-transit message when in-transit', () => {
    let consoleSpy = jest.spyOn(console, 'log');
    inTransit();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
