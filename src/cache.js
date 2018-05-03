const NodeCache = require('node-cache');

let cacheNode;
const check = () => {
  if (!cacheNode) {
    throw new Error('Cache has not been initialized');
  }
};

const cache = {
  init: () => {
    // 12h TTL
    cacheNode = new NodeCache({ stdTTL: 43200, checkperiod: 432400 });
    return cacheNode;
  },
  get: () => {
    check();
    return cacheNode;
  },
  clear: () => {
    cacheNode = undefined;
  },
};

module.exports = cache;
