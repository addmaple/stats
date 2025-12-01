import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, chiSquared } from '@stats/core';
import jStat from 'jstat';

// Converted from: chiSquared-test.js
describe('chiSquared - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('check pdf calculation', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check pdf calculation at x = 0.0', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check pdf calculation at x < 0', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check cdf calculation', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check cdf calculation when x outside support (x < 0)', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check inv calculation', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check inv calculation again', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

});
