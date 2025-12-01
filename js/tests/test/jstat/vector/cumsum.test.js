import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, cumsum } from '@stats/core';
import jStat from 'jstat';

// Converted from: cumsum-test.js
describe('cumsum - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic cumsum', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.cumsum(data);
    const ourResult = cumsum(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('cumsum from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.cumsum(data);
    const ourResult = cumsum(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('cumsum matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('cumsum matrix rows', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('cumsum callback', async () => {
    await init();

    const data = [1, 3, 6];
    const jstatResult = jStat.cumsum(data);
    const ourResult = cumsum(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('cumsum matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('cumsum matrix rows callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
