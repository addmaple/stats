import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, histogram } from '@stats/core';
import jStat from 'jstat';

// Converted from: histogram-test.js
describe('histogram - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('returns histogram (bin counts)', async () => {
    await init();

    const data = [1, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8];
    const jstatResult = jStat.histogram(data);
    const ourResult = histogram(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('histogram from instance', async () => {
    await init();

    const data = [1, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8];
    const jstatResult = jStat.histogram(data);
    const ourResult = histogram(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('histogram with numBins parameter', async () => {
    await init();

    const data = [1, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 10];
    const jstatResult = jStat.histogram(data);
    const ourResult = histogram(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('histogram with floating point values', async () => {
    await init();

    const data = [0.1, 0.1, 0.3, 0.5];
    const jstatResult = jStat.histogram(data);
    const ourResult = histogram(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

  it('documentation values', async () => {
    await init();

    const data = [100, 101, 102, 230, 304, 305, 400];
    const jstatResult = jStat.histogram(data);
    const ourResult = histogram(data);

    assert.deepEqual(Array.from(ourResult), Array.from(jstatResult));
  });

});
