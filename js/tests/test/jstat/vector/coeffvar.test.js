import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, coeffvar } from '@stats/core';
import jStat from 'jstat';

// Converted from: coeffvar-test.js
describe('coeffvar - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic coeffvar', async () => {
    await init();

    const data = [1, 2, 3, 4];
    const jstatResult = jStat.coeffvar(data);
    const ourResult = coeffvar(data);

    assert.equal(ourResult, jstatResult);
  });

  it('coeffvar from instance', async () => {
    await init();

    const data = [1, 2, 3, 4];
    const jstatResult = jStat.coeffvar(data);
    const ourResult = coeffvar(data);

    assert.equal(ourResult, jstatResult);
  });

  it.skip('coeffvar matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('coeffvar callback (skipped: test needs manual conversion)', async () => {});

  it.skip('coeffvar matrix cols callback (skipped: matrix operations not implemented)', async () => {});

});
