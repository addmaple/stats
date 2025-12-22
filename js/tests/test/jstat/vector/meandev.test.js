import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, meandev } from '@addmaple/stats';
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

  it.skip('meandev matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('meandev callback (skipped: test needs manual conversion)', async () => {});

  it.skip('meandev matrix cols callback (skipped: matrix operations not implemented)', async () => {});

});
