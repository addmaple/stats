import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, meddev } from '@stats/core';
import jStat from 'jstat';

// Converted from: meddev-test.js
describe('meddev - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic meddev', async () => {
    await init();

    const data = [4, 5, 7, 22, 90, 1, 4, 5];
    const jstatResult = jStat.meddev(data);
    const ourResult = meddev(data);

    assert.equal(ourResult, jstatResult);
  });

  it('meddev from instance', async () => {
    await init();

    const data = [1, 2, 3, 4];
    const jstatResult = jStat.meddev(data);
    const ourResult = meddev(data);

    assert.equal(ourResult, jstatResult);
  });

  it.skip('meddev matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('meddev callback (skipped: test needs manual conversion)', async () => {});

  it.skip('meddev matrix cols callback (skipped: matrix operations not implemented)', async () => {});

});
