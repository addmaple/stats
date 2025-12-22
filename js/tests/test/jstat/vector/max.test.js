import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, max } from '@addmaple/stats';
import jStat from 'jstat';

// Converted from: max-test.js
describe('max - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic max', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.max(data);
    const ourResult = max(data);

    assert.equal(ourResult, jstatResult);
  });

  it('max from instance', async () => {
    await init();

    const data = [1, 2, 3];
    const jstatResult = jStat.max(data);
    const ourResult = max(data);

    assert.equal(ourResult, jstatResult);
  });

  it.skip('max matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('max full matrix (skipped: matrix operations not implemented)', async () => {});

  it.skip('max callback (skipped: test needs manual conversion)', async () => {});

  it.skip('max matrix cols callback (skipped: matrix operations not implemented)', async () => {});

  it.skip('max full matrix callback (skipped: matrix operations not implemented)', async () => {});

});





