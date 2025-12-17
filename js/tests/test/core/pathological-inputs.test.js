import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { init, corrcoeff, spearmancoeff, histogram } from '@stats/core';

describe('pathological inputs (wasm boundary)', () => {
  before(async () => {
    await init();
  });

  it('spearmancoeff: rejects NaN inputs (returns NaN)', async () => {
    await init();
    const x = [1, 2, NaN, 4];
    const y = [1, 2, 3, 4];
    assert.ok(Number.isNaN(spearmancoeff(x, y)));
    assert.ok(Number.isNaN(spearmancoeff(y, x)));
  });

  it('corrcoeff: non-finite values yield NaN (no throw)', async () => {
    await init();
    const y = [1, 2, 3, 4];
    assert.ok(Number.isNaN(corrcoeff([1, 2, Infinity, 4], y)));
    assert.ok(Number.isNaN(corrcoeff([1, 2, -Infinity, 4], y)));
  });

  it('histogram: ignores NaN and ±Infinity values', async () => {
    await init();
    const data = [1, 2, NaN, 3, Infinity, -Infinity, 4];
    const bins = histogram(data, 3);
    assert.ok(bins instanceof Float64Array);
    const total = Array.from(bins).reduce((a, b) => a + b, 0);
    assert.equal(total, 4);
  });

  it('histogramEdges: invalid edges return empty (no panic)', async () => {
    const q = await import('@stats/core/quantiles');
    await q.init();

    const data = [1, 2, 3];

    const edgesNaN = [0, NaN, 10];
    const r1 = q.histogramEdges(data, edgesNaN);
    assert.ok(r1 instanceof Float64Array);
    assert.equal(r1.length, 0);

    const edgesUnsorted = [0, 10, 5];
    const r2 = q.histogramEdges(data, edgesUnsorted);
    assert.ok(r2 instanceof Float64Array);
    assert.equal(r2.length, 0);
  });
});





