import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, product } from '@addmaple/stats';
import jStat from 'jstat';

// Converted from: product-test.js
describe('product - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic product', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.product(data);
    const ourResult = product(data);

    assert.equal(ourResult, jstatResult);
  });

  it('product from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.product(data);
    const ourResult = product(data);

    assert.equal(ourResult, jstatResult);
  });

  it.skip('product matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('product full matrix (skipped: matrix operations not implemented)', async () => {});

  it.skip('product callback (skipped: test needs manual conversion)', async () => {});

  it.skip('product matrix cols callback (skipped: matrix operations not implemented)', async () => {});

  it.skip('product full matrix callback (skipped: matrix operations not implemented)', async () => {});

});
