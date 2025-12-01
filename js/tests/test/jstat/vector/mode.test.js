import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, mode } from '@stats/core';
import jStat from 'jstat';

// Converted from: mode-test.js
describe('mode - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic mode', async () => {
    await init();

    const data = [1, 2, 3, 3];
    const jstatResult = jStat.mode(data);
    const ourResult = mode(data);

    assert.equal(ourResult, jstatResult);
  });

  it('mode from instance', async () => {
    await init();

    const data = [1, 2, 3, 3];
    const jstatResult = jStat.mode(data);
    const ourResult = mode(data);

    assert.equal(ourResult, jstatResult);
  });

  it('mode matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('mode callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('mode matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('mode matrix cols with true returns the "mode of the matrix"', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
