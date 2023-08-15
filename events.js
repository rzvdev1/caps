'use strict';

const chance = require('chance').Chance();

const events = {
  pickup: 'pickup',
  delivered: 'delivered',
  ready: 'ready',
};

class Queue {
  constructor() {
    this.queue = [];
  }
  enqueue(item) {
    this.queue.unshift(item);
  }

  dequeue() {
    return this.queue.pop();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

module.exports = { chance, events, Queue };
