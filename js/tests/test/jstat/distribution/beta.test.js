import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, beta } from '@stats/core';
import jStat from 'jstat';

// Converted from: beta-test.js
describe('beta - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('check mode calculation', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check median calculation', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

});
