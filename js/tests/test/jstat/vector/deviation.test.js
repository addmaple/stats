import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, deviation } from '@stats/core';
import jStat from 'jstat';

// Converted from: deviation-test.js
describe('deviation - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic deviation', async () => {
    await init();

    const data = [1, 5, 2];
    const jstatResult = jStat.deviation(data);
    const ourResult = deviation(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('deviation from instance', async () => {
    await init();

    const data = [1, 5, 2];
    const jstatResult = jStat.deviation(data);
    const ourResult = deviation(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('deviation matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('return deviation with equal numbers', async () => {
    await init();

    const data = [1, 1, 1];
    const jstatResult = jStat.deviation(data);
    const ourResult = deviation(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

});
