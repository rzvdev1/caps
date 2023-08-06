var Chance = require('chance');

// Instantiate Chance so it can be used
let chance = new Chance();

let customer = `${chance.first()} ${chance.last()}`;
let address = `${chance.address()} ${chance.city()} ${chance.state()} ${chance.zip()}`;
let orderId = chance.guid();
let time = new Date().toISOString();
let store = chance.company();

console.log(time);
console.log(customer);
console.log(address);
console.log(orderId);
console.log(store);
