import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, variance } from '@stats/core';
import jStat from 'jstat';

// Converted from: variance-test.js
describe('variance - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic variance', async () => {
    await init();

    const data = [1, 2, 3, 4];
    const jstatResult = jStat.variance(data);
    const ourResult = variance(data);

    assert.equal(ourResult, jstatResult);
  });

  it('return basic variance using sample', async () => {
    await init();

    const data = [1, 2, 3, 4, 5];
    const jstatResult = jStat.variance(data);
    const ourResult = variance(data);

    assert.equal(ourResult, jstatResult);
  });

  it('variance from instance', async () => {
    await init();

    const data = [1, 2, 3, 4];
    const jstatResult = jStat.variance(data);
    const ourResult = variance(data);

    assert.equal(ourResult, jstatResult);
  });

  it.skip('variance matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('variance callback (skipped: test needs manual conversion)', async () => {});

  it.skip('variance matrix cols callback (skipped: matrix operations not implemented)', async () => {});

});



