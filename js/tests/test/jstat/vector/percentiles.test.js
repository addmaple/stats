import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, quantiles, percentiles } from '@stats/core';
import jStat from 'jstat';

describe('percentiles helper', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('returns the same result as quantiles', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6];
    const ps = [0.25, 0.5, 0.75];

    const q = quantiles(data, ps);
    const p = percentiles(data, ps);

    assert.deepEqual(Array.from(p), Array.from(q));
  });

  it('matches jStat.quantiles for multiple percentiles', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6];
    const ps = [0.1, 0.5, 0.9];

    const expected = jStat.quantiles(data, ps);
    const actual = percentiles(data, ps);

    assert.deepEqual(Array.from(actual), Array.from(expected));
  });
});

