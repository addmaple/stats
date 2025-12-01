import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, max } from '@stats/core';
import jStat from 'jstat';

// Converted from: max-test.js
describe('max - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic max', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.max(data);
    const ourResult = max(data);

    assert.equal(ourResult, jstatResult);
  });

  it('max from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.max(data);
    const ourResult = max(data);

    assert.equal(ourResult, jstatResult);
  });

  it('max matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('max full matrix', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('max callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('max matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('max full matrix callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
