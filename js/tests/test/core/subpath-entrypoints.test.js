import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import * as stats from '@stats/core/stats';
import * as quantiles from '@stats/core/quantiles';
import * as corr from '@stats/core/correlation';
import * as dists from '@stats/core/distributions';
import * as tests from '@stats/core/tests';

describe('subpath entrypoints (coverage + sanity)', () => {
  it('stats entrypoint works', async () => {
    await stats.init();
    await stats.init(); // already-initialized branch
    const data = [1, 2, 3, 4, 5];
    const f64 = Float64Array.from(data);
    const f32 = Float32Array.from(data);
    const arrayLike = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, length: 5 };
    assert.equal(typeof stats.mean(data), 'number');
    assert.equal(typeof stats.mean(f64), 'number');
    assert.equal(typeof stats.mean(f32), 'number');
    assert.equal(typeof stats.mean(arrayLike), 'number');
    assert.equal(typeof stats.sum(data), 'number');
    assert.equal(typeof stats.variance(data), 'number');
    assert.equal(typeof stats.sampleVariance(data), 'number');
    assert.equal(typeof stats.stdev(data), 'number');
    assert.equal(typeof stats.sampleStdev(data), 'number');
    assert.equal(typeof stats.coeffvar(data), 'number');
    assert.equal(typeof stats.min(data), 'number');
    assert.equal(typeof stats.max(data), 'number');
    assert.ok(stats.cumsum(data) instanceof Float64Array);
    assert.ok(stats.cumprod(f64) instanceof Float64Array);
    assert.ok(stats.diff(data) instanceof Float64Array);
    assert.ok(stats.rank(data) instanceof Float64Array);
    assert.equal(typeof stats.product(data), 'number');
    assert.equal(typeof stats.range(data), 'number');
    assert.equal(typeof stats.median(data), 'number');
    assert.equal(typeof stats.mode(data), 'number');
    assert.equal(typeof stats.geomean([1, 2, 3]), 'number');
    assert.equal(typeof stats.skewness(data), 'number');
    assert.equal(typeof stats.kurtosis(data), 'number');
    assert.ok(stats.histogram(data, 3) instanceof Float64Array);

    // empty branches
    assert.ok(Number.isNaN(stats.min([])));
    assert.ok(Number.isNaN(stats.max([])));
    assert.equal(stats.sum([]), 0);
    assert.ok(Number.isNaN(stats.mean([])));
    assert.ok(Number.isNaN(stats.variance([])));
    assert.ok(Number.isNaN(stats.product([])));
    assert.ok(Number.isNaN(stats.median([])));
    assert.ok(Number.isNaN(stats.mode([])));
    assert.ok(stats.cumsum([]) instanceof Float64Array);
  });

  it('quantiles entrypoint works', async () => {
    await quantiles.init();
    const data = [10, 20, 30, 40, 50];
    const f64 = Float64Array.from(data);
    const f32 = Float32Array.from(data);
    const arrayLike = { 0: 10, 1: 20, 2: 30, 3: 40, 4: 50, length: 5 };
    assert.equal(typeof quantiles.percentile(data, 0.5), 'number');
    assert.equal(typeof quantiles.percentile(data, 0.5, true), 'number');
    assert.equal(typeof quantiles.percentile(f32, 0.5), 'number');
    assert.equal(typeof quantiles.percentile(arrayLike, 0.5), 'number');
    assert.equal(typeof quantiles.percentileInclusive(data, 0.5), 'number');
    assert.equal(typeof quantiles.percentileExclusive(data, 0.5), 'number');
    assert.equal(typeof quantiles.percentileOfScore(data, 30, false), 'number');
    assert.equal(typeof quantiles.percentileOfScore(data, 30, true), 'number');
    assert.ok(quantiles.quantiles(data, [0.25, 0.5, 0.75]) instanceof Float64Array);
    assert.ok(quantiles.quantiles(f64, Float64Array.from([0.25, 0.5, 0.75])) instanceof Float64Array);
    assert.ok(quantiles.percentiles(data, [0.25, 0.75]) instanceof Float64Array);
    assert.ok(Array.isArray(quantiles.quartiles(data)));
    assert.equal(typeof quantiles.iqr(data), 'number');
    assert.ok(quantiles.histogram(data, 4) instanceof Float64Array);
    assert.ok(quantiles.histogramEdges(data, [0, 25, 50, 75]) instanceof Float64Array);

    // empty branches
    assert.ok(Number.isNaN(quantiles.percentile([], 0.5)));
    assert.ok(quantiles.quantiles([], [0.5]) instanceof Float64Array);
  });

  it('correlation entrypoint works', async () => {
    await corr.init();
    const x = [1, 2, 3, 4];
    const y = [1, 3, 2, 5];
    assert.equal(typeof corr.corrcoeff(x, y), 'number');
    assert.equal(typeof corr.spearmancoeff(x, y), 'number');
    assert.ok(Number.isNaN(corr.corrcoeff([1, 2], [1])));
    assert.ok(Number.isNaN(corr.corrcoeff([], [])));
  });

  it('distributions entrypoint works (scalar + array)', async () => {
    await dists.init();
    await dists.init(); // already-initialized branch

    const xs = Float64Array.from([0.1, 0.5, 1.0, 2.0]);
    const ks = Float64Array.from([0, 1, 2, 3]);

    const continuous = [
      dists.normal(),
      dists.normal({ mean: 10, sd: 2 }),
      dists.gamma({ shape: 2, rate: 3 }),
      dists.gamma({ shape: 2, scale: 0.5 }),
      dists.beta({ alpha: 2, beta: 3 }),
      dists.studentT({ mean: 0, scale: 1, dof: 3 }),
      dists.chiSquared({ dof: 4 }),
      dists.fisherF({ df1: 2, df2: 5 }),
      dists.exponential({ rate: 2 }),
      dists.exponential({ scale: 0.5 }),
      dists.uniform({ min: -1, max: 2 }),
      dists.cauchy({ local: 0, scale: 1 }),
      dists.laplace({ mu: 0, b: 1 }),
      dists.weibull({ scale: 1.5, shape: 2 }),
      dists.pareto({ scale: 1, shape: 2 }),
      dists.triangular({ min: 0, max: 2, mode: 0.5 }),
      dists.triangular({ min: 0, max: 2 }),
      dists.inverseGamma({ shape: 2, rate: 1.5 }),
      dists.logNormal({ mu: 0, sigma: 1 }),
    ];

    for (const d of continuous) {
      assert.equal(typeof d.pdf(0.5), 'number');
      assert.equal(typeof d.cdf(0.5), 'number');
      assert.equal(typeof d.inv(0.5), 'number');
      assert.ok(d.pdfArray(xs) instanceof Float64Array);
      assert.ok(d.cdfArray(xs) instanceof Float64Array);
      // empty-array branches for array kernels
      assert.ok(d.pdfArray([]) instanceof Float64Array);
      assert.ok(d.cdfArray(new Float64Array()) instanceof Float64Array);
    }

    const discrete = [
      dists.poisson({ lambda: 2 }),
      dists.binomial({ n: 5, p: 0.4 }),
      dists.negativeBinomial({ r: 3, p: 0.4 }),
    ];
    for (const d of discrete) {
      assert.equal(typeof d.pdf(2), 'number');
      assert.equal(typeof d.cdf(2), 'number');
      assert.equal(typeof d.inv(0.5), 'number');
      assert.ok(d.pdfArray(ks) instanceof Float64Array);
      assert.ok(d.cdfArray(ks) instanceof Float64Array);
      assert.ok(d.pdfArray([]) instanceof Float64Array);
      assert.ok(d.cdfArray(new Float64Array()) instanceof Float64Array);
    }
  });

  it('tests entrypoint works (ttest/ztest/regress)', async () => {
    await tests.init();
    const data = [1, 2, 3, 4, 5];
    const t = tests.ttest(data, 3);
    assert.equal(typeof t.statistic, 'number');
    const t0 = tests.ttest([], 3);
    assert.ok(Number.isNaN(t0.statistic));
    const z = tests.ztest(data, 3, 1);
    assert.equal(typeof z.p_value, 'number');
    const z0 = tests.ztest([], 3, 1);
    assert.ok(Number.isNaN(z0.p_value));
    assert.throws(() => tests.regress([1, 2], [1]), /same length/i);
    const r = tests.regress([1, 2, 3, 4], [2, 4, 6, 9]);
    assert.ok(r.residuals instanceof Float64Array);
    const r0 = tests.regress([], []);
    assert.ok(r0.residuals instanceof Float64Array);
    assert.ok(Array.isArray(tests.normalci(0.05, 10, 2)));
    assert.ok(Array.isArray(tests.tci(0.05, 10, 2, 10)));
  });
});

