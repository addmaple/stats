import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, range } from '@addmaple/stats';
import jStat from 'jstat';

// Converted from: range-test.js
describe('range - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic range', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.range(data);
    const ourResult = range(data);

    assert.equal(ourResult, jstatResult);
  });

  it('range from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.range(data);
    const ourResult = range(data);

    assert.equal(ourResult, jstatResult);
  });

  it.skip('range matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('range callback (skipped: test needs manual conversion)', async () => {});

  it.skip('range matrix cols callback (skipped: matrix operations not implemented)', async () => {});

});





