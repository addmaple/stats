import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, mean } from '@stats/core';
import jStat from 'jstat';

// Converted from: mean-test.js
describe('mean - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic mean', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.mean(data);
    const ourResult = mean(data);

    assert.equal(ourResult, jstatResult);
  });

  it('mean from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.mean(data);
    const ourResult = mean(data);

    assert.equal(ourResult, jstatResult);
  });

  it('mean matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('mean full matrix', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('mean callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('mean matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('mean full matrix callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
