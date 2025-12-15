import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, beta } from '@stats/core';
import jStat from 'jstat';

// Converted from: beta-test.js
describe('beta - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it.skip('check mode calculation (skipped: test needs manual conversion)', async () => {});

  it.skip('check median calculation (skipped: test needs manual conversion)', async () => {});

});
