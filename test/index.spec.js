import crypto from 'crypto';
import { expect } from 'chai';
import { describe } from 'node-tdd';
import LRU from '../src/index.js';

describe('Testing LRUe', () => {
  let error;
  let key;
  let value;
  let valueFn;
  let valueFnError;
  let valueFnSyncError;
  let valueFnNull;
  let valueFnSyncNull;

  before(() => {
    error = new Error();
    key = crypto.randomBytes(8).toString('hex');
    value = crypto.randomBytes(8).toString('hex');
    valueFn = () => value;
    valueFnError = async () => { throw error; };
    valueFnSyncError = () => { throw error; };
    valueFnNull = async () => null;
    valueFnSyncNull = () => null;
  });

  let cache;
  let cacheNoNull;
  beforeEach(() => {
    cache = new LRU({ max: 10000, ttl: 5 * 60 * 1000 });
    cacheNoNull = new LRU({ max: 10000, ttl: 5 * 60 * 1000, cacheNull: false });
  });

  describe('Testing memoize', () => {
    it('Testing basic caching behaviour', async () => {
      expect(cache.peek(key)).to.equal(undefined);
      expect(await cache.memoize(key, valueFn)).to.equal(value);
      expect(cache.peek(key)).to.equal(value);
      expect(await cache.memoize(key, valueFnError)).to.equal(value);
      expect(cache.peek(key)).to.equal(value);
    });

    it('Testing async error re-empties cache', async ({ capture }) => {
      expect(cache.peek(key)).to.equal(undefined);
      const e = await capture(() => cache.memoize(key, valueFnError));
      expect(e).to.equal(error);
      expect(cache.peek(key)).to.equal(undefined);
    });

    it('Testing null cached', async () => {
      expect(cache.peek(key)).to.equal(undefined);
      const r = await cache.memoize(key, valueFnNull);
      expect(r).to.equal(null);
      expect(await cache.peek(key)).to.equal(null);
    });

    it('Testing null not cached', async () => {
      expect(cacheNoNull.peek(key)).to.equal(undefined);
      const r = await cacheNoNull.memoize(key, valueFnNull);
      expect(r).to.equal(null);
      expect(cacheNoNull.peek(key)).to.equal(undefined);
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

    it('Testing null cached', async () => {
      expect(cache.peek(key)).to.equal(undefined);
      const r = cache.memoizeSync(key, valueFnSyncNull);
      expect(r).to.equal(null);
      expect(cache.peek(key)).to.equal(null);
    });

    it('Testing null not cached', async () => {
      expect(cacheNoNull.peek(key)).to.equal(undefined);
      const r = cacheNoNull.memoizeSync(key, valueFnSyncNull);
      expect(r).to.equal(null);
      expect(cacheNoNull.peek(key)).to.equal(undefined);
    });

    it('Testing error if async', async ({ capture }) => {
      const err = await capture(() => cache.memoizeSync(key, async () => {}));
      expect(err.message).to.equal('Use memoize() instead');
    });
  });
});
