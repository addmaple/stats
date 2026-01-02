import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, weibull } from '@addmaple/stats';
import jStat from 'jstat';

// Converted from: weibull-test.js
describe('weibull - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it.skip('check pdf calculation (skipped: test needs manual conversion)', async () => {});

  it.skip('check cdf calculation (skipped: test needs manual conversion)', async () => {});

  it.skip('mean (skipped: test needs manual conversion)', async () => {});

  it.skip('median (skipped: test needs manual conversion)', async () => {});

  it.skip('mode (skipped: test needs manual conversion)', async () => {});

  it.skip('variance (skipped: test needs manual conversion)', async () => {});

});
