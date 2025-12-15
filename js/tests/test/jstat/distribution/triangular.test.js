import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, triangular } from '@stats/core';
import jStat from 'jstat';

// Converted from: triangular-test.js
describe('triangular - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it.skip('check pdf calculation, when a < c < b (skipped: test needs manual conversion)', async () => {});

  it.skip('check pdf calculation, when a = c < b (skipped: test needs manual conversion)', async () => {});

  it.skip('check pdf calculation, when a < c = b (skipped: test needs manual conversion)', async () => {});

  it.skip('check pdf calculation, when c < a (skipped: test needs manual conversion)', async () => {});

  it.skip('check pdf calculation, when b < c (skipped: test needs manual conversion)', async () => {});

  it.skip('check pdf calculation, when a = b (skipped: test needs manual conversion)', async () => {});

  it.skip('check cdf calculation, when a < c < b (skipped: test needs manual conversion)', async () => {});

  it.skip('check cdf calculation, when a = c < b (skipped: test needs manual conversion)', async () => {});

  it.skip('check cdf calculation, when a < c = b (skipped: test needs manual conversion)', async () => {});

  it.skip('check cdf calculation, when c < a (skipped: test needs manual conversion)', async () => {});

  it.skip('check cdf calculation, when b < c (skipped: test needs manual conversion)', async () => {});

  it.skip('check cdf calculation, when a = b (skipped: test needs manual conversion)', async () => {});

  it.skip('check inv calculation, when a < c < b (skipped: test needs manual conversion)', async () => {});

  it.skip('check inv calculation, when a = c < b (skipped: test needs manual conversion)', async () => {});

  it.skip('check inv calculation, when a < c = b (skipped: test needs manual conversion)', async () => {});

  it.skip('check inv calculation, when c < a (skipped: test needs manual conversion)', async () => {});

  it.skip('check inv calculation, when b < c (skipped: test needs manual conversion)', async () => {});

  it.skip('check inv calculation, when a = b (skipped: test needs manual conversion)', async () => {});

});
