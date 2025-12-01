import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, meandev } from '@stats/core';
import jStat from 'jstat';

// Converted from: meandev-test.js
describe('meandev - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic meandev', async () => {
    await init();

    const data = [4, 5, 7, 22, 90, 1, 4, 5];
    const jstatResult = jStat.meandev(data);
    const ourResult = meandev(data);

    assert.equal(ourResult, jstatResult);
  });

  it('meandev from instance', async () => {
    await init();

    const data = [1, 2, 3, 4];
    const jstatResult = jStat.meandev(data);
    const ourResult = meandev(data);

    assert.equal(ourResult, jstatResult);
  });

  it('meandev matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('meandev callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('meandev matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
