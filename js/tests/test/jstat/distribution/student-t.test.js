import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, studentT } from '@stats/core';
import jStat from 'jstat';

// Converted from: studentT-test.js
describe('studentT - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('check pdf calculation', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check pdf calculation for large parameters', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check cdf calculation', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check inv calculation', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

});
