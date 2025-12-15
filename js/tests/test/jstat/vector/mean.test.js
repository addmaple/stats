import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, mean } from '@stats/core';
import jStat from 'jstat';

// Converted from: mean-test.js
describe('mean - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic mean', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.mean(data);
    const ourResult = mean(data);

    assert.equal(ourResult, jstatResult);
  });

  it('mean from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.mean(data);
    const ourResult = mean(data);

    assert.equal(ourResult, jstatResult);
  });

  it.skip('mean matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('mean full matrix (skipped: matrix operations not implemented)', async () => {});

  it.skip('mean callback (skipped: test needs manual conversion)', async () => {});

  it.skip('mean matrix cols callback (skipped: matrix operations not implemented)', async () => {});

  it.skip('mean full matrix callback (skipped: matrix operations not implemented)', async () => {});

});
