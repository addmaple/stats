import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, stdev } from '@addmaple/stats';
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

  it.skip('stdev matrix cols (skipped: matrix operations not implemented)', async () => {});

  it.skip('stdev callback (skipped: test needs manual conversion)', async () => {});

  it.skip('stdev matrix cols callback (skipped: matrix operations not implemented)', async () => {});

});





