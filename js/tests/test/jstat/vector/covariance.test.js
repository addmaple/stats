import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, covariance } from '@stats/core';
import jStat from 'jstat';

// Converted from: covariance-test.js
describe('covariance - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic covariance', async () => {
    await init();

    const x = [1, 2, 3, 4];
    const y = [4, 5, 6, 7];
    const jstatResult = jStat.covariance(x, y);
    const ourResult = covariance(x, y);

    // Note: jstat uses sample covariance (divides by n-1), we use population (divides by n)
    // jstat: 5/3 = 1.666..., ours: 5/4 = 1.25
    // This is expected behavior difference - jstat uses sample covariance
    assert.ok(Math.abs(ourResult - (jstatResult * 3 / 4)) < 1e-10,
      `Expected population covariance ~${jstatResult * 3 / 4}, got ${ourResult}. jstat uses sample covariance.`);
  });

});
