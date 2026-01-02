import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, chiSquared } from '@addmaple/stats';
import jStat from 'jstat';

// Converted from: chiSquared-test.js
describe('chiSquared - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it.skip('check pdf calculation (skipped: test needs manual conversion)', async () => {});

  it.skip('check pdf calculation at x = 0.0 (skipped: test needs manual conversion)', async () => {});

  it.skip('check pdf calculation at x < 0 (skipped: test needs manual conversion)', async () => {});

  it.skip('check cdf calculation (skipped: test needs manual conversion)', async () => {});

  it.skip('check cdf calculation when x outside support (x < 0) (skipped: test needs manual conversion)', async () => {});

  it.skip('check inv calculation (skipped: test needs manual conversion)', async () => {});

  it.skip('check inv calculation again (skipped: test needs manual conversion)', async () => {});

});
