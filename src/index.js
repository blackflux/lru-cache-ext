const assert = require('assert');
const LRU = require('lru-cache');

class LRUe extends LRU {
  async memoize(key, valueFn) {
    assert(typeof valueFn === 'function');
    if (!this.has(key)) {
      this.set(key, valueFn());
    }
    try {
      return await this.peek(key);
    } catch (error) {
      this.del(key);
      throw error;
    }
  }
}

module.exports = LRUe;
