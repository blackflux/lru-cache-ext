const assert = require('assert');
const LRU = require('lru-cache');

class LRUe extends LRU {
  constructor({ cacheNull, ...options }) {
    super(options);
    this.cacheNull = cacheNull === true;
  }

  async memoize(key, valueFn) {
    assert(typeof valueFn === 'function');
    if (!this.has(key)) {
      this.set(key, valueFn());
    }
    try {
      const r = await this.peek(key);
      if (r === null && this.cacheNull !== true) {
        this.del(key);
      }
      return r;
    } catch (error) {
      this.del(key);
      throw error;
    }
  }

  memoizeSync(key, valueFn) {
    assert(typeof valueFn === 'function');
    if (!this.has(key)) {
      this.set(key, valueFn());
    }
    const r = this.peek(key);
    if (r === null && this.cacheNull !== true) {
      this.del(key);
    }
    return r;
  }
}

module.exports = LRUe;
