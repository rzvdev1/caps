'use strict';
const { it } = require('node:test');
const event = require('../driver/driver.js');
const { describe } = require('yargs');

describe('Testing the driver module', () => {
  it('should emit pickup', () => {
    let consoleSpy = jest.spyOn(console, 'log');
    event.emit('pickup', { event: 'pickup', payload: '1' });
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should emit in-transit', () => {
    let consoleSpy = jest.spyOn(console, 'log');
    event.emit('in-transit', { event: 'in-transit', payload: '1' });
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should emit delivered', () => {
    let consoleSpy = jest.spyOn(console, 'log');
    event.emit('delivered', { event: 'delivered', payload: '1' });
    expect(consoleSpy).toHaveBeenCalled();
  });
});
