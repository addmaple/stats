import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, min } from '@stats/core';
import jStat from 'jstat';

// Converted from: min-test.js
describe('min - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic min', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.min(data);
    const ourResult = min(data);

    assert.equal(ourResult, jstatResult);
  });

  it('min from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.min(data);
    const ourResult = min(data);

    assert.equal(ourResult, jstatResult);
  });

  it.skip('min matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('min full matrix (skipped: matrix operations not implemented)', async () => {});

  it.skip('min callback (skipped: test needs manual conversion)', async () => {});

  it.skip('min matrix cols callback (skipped: matrix operations not implemented)', async () => {});

  it.skip('min full matrix callback (skipped: matrix operations not implemented)', async () => {});

});
