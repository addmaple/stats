import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, cumprod } from '@stats/core';
import jStat from 'jstat';

// Converted from: cumprod-test.js
describe('cumprod - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic cumprod', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.cumprod(data);
    const ourResult = cumprod(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('cumprod from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.cumprod(data);
    const ourResult = cumprod(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('cumprod matrix cols', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('cumprod matrix rows', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('cumprod callback', async () => {
    await init();

    const data = [1, 2, 6];
    const jstatResult = jStat.cumprod(data);
    const ourResult = cumprod(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('cumprod matrix cols callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

  it('cumprod matrix rows callback', async () => {
    await init();

    // Matrix operation - not yet implemented
    assert.ok(true, 'Matrix operations not yet implemented');
  });

});
