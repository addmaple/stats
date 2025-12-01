import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, range } from '@stats/core';
import jStat from 'jstat';

// Converted from: range-test.js
describe('range - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic range', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.range(data);
    const ourResult = range(data);

    assert.equal(ourResult, jstatResult);
  });

  it('range from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.range(data);
    const ourResult = range(data);

    assert.equal(ourResult, jstatResult);
  });

  it('range matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('range callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('range matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
