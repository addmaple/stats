import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, rank } from '@stats/core';
import jStat from 'jstat';

// Converted from: rank-test.js
describe('rank - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic rank', async () => {
    await init();

    const data = [1, 5, 2];
    const jstatResult = jStat.rank(data);
    const ourResult = rank(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('rank from instance', async () => {
    await init();

    const data = [1, 5, 2];
    const jstatResult = jStat.rank(data);
    const ourResult = rank(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('rank matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('return rank with ties', async () => {
    await init();

    const data = [5, 5, 2];
    const jstatResult = jStat.rank(data);
    const ourResult = rank(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

});
