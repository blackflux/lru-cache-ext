const assert = require('assert');
const LRU = require('lru-cache');

class LRUe extends LRU {
  constructor({ cacheNull = true, ...options }) {
    super(options);
    this.cacheNull = cacheNull;
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
      const r = valueFn();
      assert(!(r instanceof Promise), 'Use memoize() instead');
      this.set(key, r);
    }
    const r = this.peek(key);
    if (r === null && this.cacheNull !== true) {
      this.del(key);
    }
    return r;
  }
}

module.exports = LRUe;
