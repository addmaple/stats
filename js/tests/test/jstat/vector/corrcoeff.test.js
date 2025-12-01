import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, corrcoeff } from '@stats/core';
import jStat from 'jstat';

// Converted from: corrcoeff-test.js
describe('corrcoeff - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic corrcoeff', async () => {
    await init();

    const x = [1, 2, 3, 4];
    const y = [4, 5, 6, 7];
    const jstatResult = jStat.corrcoeff(x, y);
    const ourResult = corrcoeff(x, y);

    // Use approximate equality for floating point
    assert.ok(Math.abs(ourResult - jstatResult) < 1e-10,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

});
