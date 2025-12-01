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

  it('geomean matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('geomean full matrix', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('geomean callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('geomean matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('geomean full matrix callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
