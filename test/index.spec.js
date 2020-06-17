const crypto = require('crypto');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const LRU = require('../src/index');

describe('Testing LRUe', () => {
  let error;
  let key;
  let value;
  let valueFn;
  let valueFnError;
  let valueFnSyncError;

  before(() => {
    error = new Error();
    key = crypto.randomBytes(8).toString('hex');
    value = crypto.randomBytes(8).toString('hex');
    valueFn = () => value;
    valueFnError = async () => { throw error; };
    valueFnSyncError = () => { throw error; };
  });

  let cache;
  beforeEach(() => {
    cache = new LRU({ maxAge: 5 * 60 * 1000 });
  });

  describe('Testing memoize', () => {
    it('Testing basic caching behaviour', async () => {
      expect(cache.peek(key)).to.equal(undefined);
      expect(await cache.memoize(key, valueFn)).to.equal(value);
      expect(cache.peek(key)).to.equal(value);
      expect(await cache.memoize(key, valueFnError)).to.equal(value);
      expect(cache.peek(key)).to.equal(value);
    });

    it('Testing async error re-empties cache', async () => {
      expect(cache.peek(key)).to.equal(undefined);
      try {
        await cache.memoize(key, valueFnError);
      } catch (e) {
        expect(e).to.equal(error);
      }
      expect(cache.peek(key)).to.equal(undefined);
    });
  });

  describe('Testing memoizeSync', () => {
    it('Testing basic sync caching behavior', () => {
      expect(cache.peek(key)).to.equal(undefined);
      expect(cache.memoizeSync(key, valueFn)).to.equal(value);
      expect(cache.peek(key)).to.equal(value);
      expect(cache.memoizeSync(key, valueFn)).to.equal(value);
    });

    it('Testing basic sync error behavior', () => {
      expect(cache.peek(key)).to.equal(undefined);
      try {
        cache.memoizeSync(key, valueFnSyncError);
      } catch (e) {
        expect(e).to.equal(error);
      }
      expect(cache.peek(key)).to.equal(undefined);
    });
  });
});
