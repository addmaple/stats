import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, studentT } from '@stats/core';
import jStat from 'jstat';

// Converted from: studentT-test.js
describe('studentT - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it.skip('check pdf calculation (skipped: test needs manual conversion)', async () => {});

  it.skip('check pdf calculation for large parameters (skipped: test needs manual conversion)', async () => {});

  it.skip('check cdf calculation (skipped: test needs manual conversion)', async () => {});

  it.skip('check inv calculation (skipped: test needs manual conversion)', async () => {});

});
