import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, skewness } from '@stats/core';
import jStat from 'jstat';

// Converted from: skewness-test.js
describe('skewness - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('returns accurate skewness value', async () => {
    await init();

    const data = [-0.28157961, -0.75577350,  0.61554139,  0.26864022, -0.42703435,
           -0.99927791, -0.07113527, -1.39327183,  0.34871138,  1.17909042,
           -0.22951562,  0.22341714];
    const jstatResult = jStat.skewness(data);
    const ourResult = skewness(data);

    // Use approximate equality for floating point comparison
    assert.ok(Math.abs(ourResult - jstatResult) < 1e-10,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

  it('skewness from instance', async () => {
    await init();

    const data = [-0.28157961, -0.75577350,  0.61554139,  0.26864022, -0.42703435,
           -0.99927791, -0.07113527, -1.39327183,  0.34871138,  1.17909042,
           -0.22951562,  0.22341714];
    const jstatResult = jStat(data).skewness();
    const ourResult = skewness(data);

    // Use approximate equality for floating point comparison
    assert.ok(Math.abs(ourResult - jstatResult) < 1e-10,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

});
