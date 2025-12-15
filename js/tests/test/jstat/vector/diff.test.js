import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, diff } from '@stats/core';
import jStat from 'jstat';

// Converted from: diff-test.js
describe('diff - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic diff', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.diff(data);
    const ourResult = diff(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('diff from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.diff(data);
    const ourResult = diff(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it.skip('diff matrix cols (skipped: matrix operations not implemented)', async () => {});

  it('diff callback', async () => {
    await init();

    const data = [1, 1];
    const jstatResult = jStat.diff(data);
    const ourResult = diff(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it.skip('diff matrix cols callback (skipped: matrix operations not implemented)', async () => {});

});
