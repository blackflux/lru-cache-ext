# lru-cache-ext

[![Build Status](https://circleci.com/gh/blackflux/lru-cache-ext.png?style=shield)](https://circleci.com/gh/blackflux/lru-cache-ext)
[![Test Coverage](https://img.shields.io/coveralls/blackflux/lru-cache-ext/master.svg)](https://coveralls.io/github/blackflux/lru-cache-ext?branch=master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=blackflux/lru-cache-ext)](https://dependabot.com)
[![Dependencies](https://david-dm.org/blackflux/lru-cache-ext/status.svg)](https://david-dm.org/blackflux/lru-cache-ext)
[![NPM](https://img.shields.io/npm/v/lru-cache-ext.svg)](https://www.npmjs.com/package/lru-cache-ext)
[![Downloads](https://img.shields.io/npm/dt/lru-cache-ext.svg)](https://www.npmjs.com/package/lru-cache-ext)
[![Semantic-Release](https://github.com/blackflux/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/blackflux/js-gardener/blob/master/assets/badge.svg)](https://github.com/blackflux/js-gardener)

Thin wrapper around lru-cache with extended functionality.

## Install

Install with [npm](https://www.npmjs.com/):

    $ npm install --save lru-cache-ext

## Usage

Please refer to [lru-cache](https://www.npmjs.com/package/lru-cache).

## Additional Options

### cacheNull

Type: `boolean`<br>
Default: `true`

When set to other than `true`, the `null` value is not cached with `memoize` and `memoizeSync`.

## Additional Functions

### memoize(key: String, valueFn: function)

Only when the key is not present in cache (or has expired), `valueFn` is called and placed into cache.

The cached value is returned when it becomes available (important in the case where `valueFn` is async).

The cache is left empty if an error is thrown at any point in `valueFn` (even asynchronous).

Useful when multiple async operation need to access the same async information.

### memoizeSync(key: String, valueFn: function)

Similar to "memoize", when key is not present (or has expired), `valueFn` is called and placed into the cache.

Cached value is returned from the function.

`valueFn` can be a synchronous or asynchronous function.

If `valueFn` is an asynchronous function and an error is thrown asynchronously, the cache is not invalidated.
