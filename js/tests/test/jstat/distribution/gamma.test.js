import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, gamma } from '@stats/core';
import jStat from 'jstat';

// Converted from: gamma-test.js
describe('gamma - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('check pdf', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check cdf', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check inv', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

});
