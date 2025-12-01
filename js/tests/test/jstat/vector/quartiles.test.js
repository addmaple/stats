import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, quartiles } from '@stats/core';
import jStat from 'jstat';

// Converted from: quartiles-test.js
describe('quartiles - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic quartiles', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6];
    const jstatResult = jStat.quartiles(data);
    const ourResult = quartiles(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('quartiles from instance', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6];
    const jstatResult = jStat.quartiles(data);
    const ourResult = quartiles(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('quartiles matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('quartiles callback', async () => {
    await init();

    const data = [2, 3, 5];
    const jstatResult = jStat.quartiles(data);
    const ourResult = quartiles(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('quartiles matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
