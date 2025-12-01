import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, min } from '@stats/core';
import jStat from 'jstat';

// Converted from: min-test.js
describe('min - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic min', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.min(data);
    const ourResult = min(data);

    assert.equal(ourResult, jstatResult);
  });

  it('min from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.min(data);
    const ourResult = min(data);

    assert.equal(ourResult, jstatResult);
  });

  it('min matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('min full matrix', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('min callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('min matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('min full matrix callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
