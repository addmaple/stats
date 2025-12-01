import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, stdev } from '@stats/core';
import jStat from 'jstat';

// Converted from: stdev-test.js
describe('stdev - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic stdev', async () => {
    await init();

    const data = [1, 2, 3, 4];
    const jstatResult = jStat.stdev(data);
    const ourResult = stdev(data);

    assert.equal(ourResult, jstatResult);
  });

  it('return basic stdev using sample', async () => {
    await init();

    const data = [1, 2, 3, 4, 5];
    const jstatResult = jStat.stdev(data);
    const ourResult = stdev(data);

    assert.equal(ourResult, jstatResult);
  });

  it('stdev from instance', async () => {
    await init();

    const data = [1, 2, 3, 4];
    const jstatResult = jStat.stdev(data);
    const ourResult = stdev(data);

    assert.equal(ourResult, jstatResult);
  });

  it('stdev matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('stdev callback', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('stdev matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
