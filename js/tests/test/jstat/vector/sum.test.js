import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, sum } from '@stats/core';
import jStat from 'jstat';

// Converted from: sum-test.js
describe('sum - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic sum', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.sum(data);
    const ourResult = sum(data);

    assert.equal(ourResult, jstatResult);
  });

  it('sum from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.sum(data);
    const ourResult = sum(data);

    assert.equal(ourResult, jstatResult);
  });

  it.skip('sum matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('sum full matrix (skipped: matrix operations not implemented)', async () => {});

  it.skip('sum callback (skipped: test needs manual conversion)', async () => {});

  it.skip('sum matrix cols callback (skipped: matrix operations not implemented)', async () => {});

  it.skip('sum full matrix callback (skipped: matrix operations not implemented)', async () => {});

});



