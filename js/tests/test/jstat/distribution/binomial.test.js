import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, binomial } from '@addmaple/stats';
import jStat from 'jstat';

// Converted from: binomial-test.js
describe('binomial - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it.skip('check pdf calculation (skipped: test needs manual conversion)', async () => {});

  it.skip('check cdf calculation (skipped: test needs manual conversion)', async () => {});

});
