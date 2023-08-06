'use strict';

const { pickup, delivered } = require('../vendor/vendor.js');

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
});
