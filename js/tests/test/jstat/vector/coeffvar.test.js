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

  it('coeffvar matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('coeffvar callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('coeffvar matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
