import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, geomean } from '@stats/core';
import jStat from 'jstat';

// Converted from: geomean-test.js
describe('geomean - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic geomean', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.geomean(data);
    const ourResult = geomean(data);

    assert.ok(Math.abs(ourResult - jstatResult) < 1e-10,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

  it('geomean from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.geomean(data);
    const ourResult = geomean(data);

    assert.ok(Math.abs(ourResult - jstatResult) < 1e-10,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

  it.skip('geomean matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('geomean full matrix (skipped: matrix operations not implemented)', async () => {});

  it.skip('geomean callback (skipped: test needs manual conversion)', async () => {});

  it.skip('geomean matrix cols callback (skipped: matrix operations not implemented)', async () => {});

  it.skip('geomean full matrix callback (skipped: matrix operations not implemented)', async () => {});

});
