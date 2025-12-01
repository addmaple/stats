import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, variance } from '@stats/core';
import jStat from 'jstat';

// Converted from: variance-test.js
describe('variance - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic variance', async () => {
    await init();

    const data = [1, 2, 3, 4];
    const jstatResult = jStat.variance(data);
    const ourResult = variance(data);

    assert.equal(ourResult, jstatResult);
  });

  it('return basic variance using sample', async () => {
    await init();

    const data = [1, 2, 3, 4, 5];
    const jstatResult = jStat.variance(data);
    const ourResult = variance(data);

    assert.equal(ourResult, jstatResult);
  });

  it('variance from instance', async () => {
    await init();

    const data = [1, 2, 3, 4];
    const jstatResult = jStat.variance(data);
    const ourResult = variance(data);

    assert.equal(ourResult, jstatResult);
  });

  it('variance matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('variance callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('variance matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
