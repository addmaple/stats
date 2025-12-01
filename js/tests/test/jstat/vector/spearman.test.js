import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, spearmancoeff } from '@stats/core';
import jStat from 'jstat';

const tol = 0.0000001;

// Converted from: spearman-test.js
describe('spearmancoeff - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic spearmancoeff', async () => {
    await init();

    const x = [1, 2, 3, 4];
    const y = [5, 6, 9, 7];
    const jstatResult = jStat.spearmancoeff(x, y);
    const ourResult = spearmancoeff(x, y);

    assert.ok(Math.abs(ourResult - jstatResult) < tol,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

  it('return spearmancoeff with ties', async () => {
    await init();

    const x = [1, 2, 3, 4];
    const y = [5, 5, 9, 7];
    const jstatResult = jStat.spearmancoeff(x, y);
    const ourResult = spearmancoeff(x, y);

    assert.ok(Math.abs(ourResult - jstatResult) < tol,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

  it('return spearmancoeff all ties', async () => {
    await init();

    const x = [1, 2, 3, 4];
    const y = [5, 5, 5, 5];
    const jstatResult = jStat.spearmancoeff(x, y);
    const ourResult = spearmancoeff(x, y);

    // Both should be NaN when all values in one array are tied
    assert.equal(isNaN(ourResult), isNaN(jstatResult));
  });

  it('return spearmancoeff unequal arrays', async () => {
    await init();

    const x = [1, 2, 3, 4];
    const y = [5, 6, 7];
    const jstatResult = jStat.spearmancoeff(x, y);
    const ourResult = spearmancoeff(x, y);

    // Both should be NaN for unequal length arrays
    assert.equal(isNaN(ourResult), isNaN(jstatResult));
  });

});
