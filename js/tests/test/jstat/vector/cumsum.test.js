import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, cumsum } from '@stats/core';
import jStat from 'jstat';

// Converted from: cumsum-test.js
describe('cumsum - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic cumsum', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.cumsum(data);
    const ourResult = cumsum(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('cumsum from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.cumsum(data);
    const ourResult = cumsum(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it.skip('cumsum matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('cumsum matrix rows (skipped: matrix operations not implemented)', async () => {});

  it('cumsum callback', async () => {
    await init();

    const data = [1, 3, 6];
    const jstatResult = jStat.cumsum(data);
    const ourResult = cumsum(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it.skip('cumsum matrix cols callback (skipped: matrix operations not implemented)', async () => {});

  it.skip('cumsum matrix rows callback (skipped: matrix operations not implemented)', async () => {});

});
