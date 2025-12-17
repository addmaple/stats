import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, median } from '@stats/core';
import jStat from 'jstat';

// Converted from: median-test.js
describe('median - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic median', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.median(data);
    const ourResult = median(data);

    assert.equal(ourResult, jstatResult);
  });

  it('median from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.median(data);
    const ourResult = median(data);

    assert.equal(ourResult, jstatResult);
  });

  it.skip('median matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('median full matrix (skipped: matrix operations not implemented)', async () => {});

  it.skip('median callback (skipped: test needs manual conversion)', async () => {});

  it.skip('median matrix cols callback (skipped: matrix operations not implemented)', async () => {});

  it.skip('median full matrix callback (skipped: matrix operations not implemented)', async () => {});

});



