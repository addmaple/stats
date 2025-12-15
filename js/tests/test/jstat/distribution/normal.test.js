import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, normal } from '@stats/core';
import jStat from 'jstat';

// Converted from: normal-test.js
describe('normal - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it.skip('check pdf calculation (skipped: test needs manual conversion)', async () => {});

  it.skip('check inv calculation (skipped: test needs manual conversion)', async () => {});

});
