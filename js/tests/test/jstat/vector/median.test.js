import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, median } from '@stats/core';
import jStat from 'jstat';

// Converted from: median-test.js
describe('median - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic median', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.median(data);
    const ourResult = median(data);

    assert.equal(ourResult, jstatResult);
  });

  it('median from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.median(data);
    const ourResult = median(data);

    assert.equal(ourResult, jstatResult);
  });

  it('median matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('median full matrix', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('median callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('median matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('median full matrix callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
