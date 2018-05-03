const cache = require('../src/cache');
const { expect } = require('chai');
const NodeCache = require('node-cache');

describe('cache', () => {
  describe('init', () => {
    it('should initialize the cache', () => {
      expect(cache.init()).to.be.instanceOf(NodeCache);
      cache.clear();
    });
  });

  describe('get', () => {
    it('should throw an error if the cache is not initialized', () => {
      expect(cache.get).to.throw();
    });

    it('should return the cache if initialized', () => {
      cache.init();
      expect(cache.get).to.not.throw();
      expect(cache.get()).to.be.instanceOf(NodeCache);
      cache.clear();
    });
  });
});

