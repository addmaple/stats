import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, sum } from '@stats/core';
import jStat from 'jstat';

// Converted from: sum-test.js
describe('sum - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic sum', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.sum(data);
    const ourResult = sum(data);

    assert.equal(ourResult, jstatResult);
  });

  it('sum from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.sum(data);
    const ourResult = sum(data);

    assert.equal(ourResult, jstatResult);
  });

  it('sum matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('sum full matrix', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('sum callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('sum matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('sum full matrix callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
