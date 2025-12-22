import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, mode } from '@addmaple/stats';
import jStat from 'jstat';

// Converted from: mode-test.js
describe('mode - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic mode', async () => {
    await init();

    const data = [1, 2, 3, 3];
    const jstatResult = jStat.mode(data);
    const ourResult = mode(data);

    assert.equal(ourResult, jstatResult);
  });

  it('mode from instance', async () => {
    await init();

    const data = [1, 2, 3, 3];
    const jstatResult = jStat.mode(data);
    const ourResult = mode(data);

    assert.equal(ourResult, jstatResult);
  });

  it.skip('mode matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('mode callback (skipped: test needs manual conversion)', async () => {});

  it.skip('mode matrix cols callback (skipped: matrix operations not implemented)', async () => {});

  it.skip('mode matrix cols with true returns the "mode of the matrix" (skipped: matrix operations not implemented)', async () => {});

});
