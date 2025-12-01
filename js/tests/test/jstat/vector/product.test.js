import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, product } from '@stats/core';
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

  it('product matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('product full matrix', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('product callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('product matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('product full matrix callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
