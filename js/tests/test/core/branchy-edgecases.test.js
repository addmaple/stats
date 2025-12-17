import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// These are intentionally "branchy" tests to hit early returns and throw paths
// in dist/quantiles.js, dist/correlation.js, and dist/tests.js.

describe('branchy edge cases (coverage)', () => {
  it('quantiles module: throws before init (fresh import)', async () => {
    const modUrl = new URL('../../../package/dist/quantiles.js', import.meta.url);
    const fresh = await import(`${modUrl.href}?t=${Date.now()}`);
    assert.throws(() => fresh.percentile([1, 2, 3], 0.5), /init\(\) first/i);
    assert.throws(() => fresh.quantiles([1, 2, 3], [0.5]), /init\(\) first/i);
  });

  it('correlation module: throws before init (fresh import)', async () => {
    const modUrl = new URL('../../../package/dist/correlation.js', import.meta.url);
    const fresh = await import(`${modUrl.href}?t=${Date.now()}`);
    assert.throws(() => fresh.corrcoeff([1], [1]), /init\(\) first/i);
  });

  it('tests module: throws before init (fresh import)', async () => {
    const modUrl = new URL('../../../package/dist/tests.js', import.meta.url);
    const fresh = await import(`${modUrl.href}?t=${Date.now()}`);
    assert.throws(() => fresh.ttest([1, 2], 0), /init\(\) first/i);
  });

  it('quantiles module: all empty/degenerate branches', async () => {
    const q = await import('@stats/core/quantiles');
    await q.init();

    assert.ok(Number.isNaN(q.percentile([], 0.5)));
    assert.ok(Number.isNaN(q.percentileInclusive([], 0.5)));
    assert.ok(Number.isNaN(q.percentileExclusive([], 0.5)));
    assert.ok(Number.isNaN(q.percentileOfScore([], 10)));

    assert.deepEqual(q.quartiles([]), [NaN, NaN, NaN]);
    assert.ok(Number.isNaN(q.iqr([])));

    // quantiles/percentiles early returns
    assert.ok(q.quantiles([], [0.5]) instanceof Float64Array);
    assert.equal(q.quantiles([], [0.5]).length, 0);
    assert.ok(q.quantiles([1, 2, 3], []) instanceof Float64Array);
    assert.equal(q.quantiles([1, 2, 3], []).length, 0);
    assert.ok(q.percentiles([1, 2, 3], []) instanceof Float64Array);
    assert.equal(q.percentiles([1, 2, 3], []).length, 0);

    // histogram early returns
    assert.ok(q.histogram([], 10) instanceof Float64Array);
    assert.equal(q.histogram([], 10).length, 0);

    // histogramEdges early returns
    assert.ok(q.histogramEdges([], [0, 1]) instanceof Float64Array);
    assert.equal(q.histogramEdges([], [0, 1]).length, 0);
    assert.ok(q.histogramEdges([1, 2, 3], []) instanceof Float64Array);
    assert.equal(q.histogramEdges([1, 2, 3], []).length, 0);
  });

  it('correlation module: mismatch/empty branches', async () => {
    const c = await import('@stats/core/correlation');
    await c.init();
    assert.ok(Number.isNaN(c.corrcoeff([1, 2], [1])));
    assert.ok(Number.isNaN(c.covariance([], [])));
    assert.ok(Number.isNaN(c.spearmancoeff([], [])));
  });

  it('tests module: mismatch/empty branches', async () => {
    const t = await import('@stats/core/tests');
    await t.init();

    const empty = t.ttest([], 0);
    assert.ok(Number.isNaN(empty.statistic));
    const emptyZ = t.ztest([], 0, 1);
    assert.ok(Number.isNaN(emptyZ.statistic));

    assert.throws(() => t.regress([1, 2], [1]), /same length/i);
    const r0 = t.regress([], []);
    assert.ok(r0.residuals instanceof Float64Array);
  });
});




