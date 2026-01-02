import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, cumprod } from '@addmaple/stats';
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

  it.skip('cumprod matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('cumprod matrix rows (skipped: matrix operations not implemented)', async () => {});

  it('cumprod callback', async () => {
    await init();

    const data = [1, 2, 6];
    const jstatResult = jStat.cumprod(data);
    const ourResult = cumprod(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it.skip('cumprod matrix cols callback (skipped: matrix operations not implemented)', async () => {});

  it.skip('cumprod matrix rows callback (skipped: matrix operations not implemented)', async () => {});

});
