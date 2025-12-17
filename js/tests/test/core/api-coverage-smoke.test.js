import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

import * as core from '@stats/core';

function assertFiniteNumber(x) {
  assert.equal(typeof x, 'number');
  assert.ok(Number.isFinite(x));
}

function assertNumber(x) {
  assert.equal(typeof x, 'number');
}

function assertF64Array(x) {
  assert.ok(x instanceof Float64Array);
}

describe('core API smoke (coverage)', () => {
  it('throws if calling wasm-backed functions before init (fresh module)', async () => {
    // Use a cache-busted file URL so we get a fresh module instance.
    const indexUrl = new URL('../../../package/dist/index.js', import.meta.url);
    const url = `${indexUrl.href}?t=${Date.now()}`;
    const fresh = await import(url);
    assert.throws(() => fresh.mean([1, 2, 3]), /init\(\) first/i);
  });

  before(async () => {
    await core.init();
    // cover the "already initialized" branch
    await core.init();
  });

  it('vector/stat functions: basic calls + empty branches', () => {
    const data = [1, 2, 3, 4, 5, 6];
    const dataF64 = Float64Array.from(data);
    const data2 = [2, 1, 0, 4, 3, 9];
    const data2F64 = Float64Array.from(data2);
    const empty = [];

    assertFiniteNumber(core.sum(data));
    assertFiniteNumber(core.sum(dataF64)); // hit Float64Array fast-path
    assertFiniteNumber(core.mean(data));
    assertFiniteNumber(core.mean(dataF64));
    assertFiniteNumber(core.variance(data));
    assertFiniteNumber(core.variance(dataF64));
    assertFiniteNumber(core.sampleVariance(data));
    assertFiniteNumber(core.sampleVariance(dataF64));
    assertFiniteNumber(core.stdev(data));
    assertFiniteNumber(core.stdev(dataF64));
    assertFiniteNumber(core.sampleStdev(data));
    assertFiniteNumber(core.sampleStdev(dataF64));
    assertFiniteNumber(core.min(data));
    assertNumber(core.min(dataF64));
    assertFiniteNumber(core.max(data));
    assertNumber(core.max(dataF64));
    assertFiniteNumber(core.product(data));
    assertFiniteNumber(core.product(dataF64));
    assertFiniteNumber(core.range(data));
    assertFiniteNumber(core.range(dataF64));
    assertNumber(core.median(data));
    assertNumber(core.median(dataF64));
    assertNumber(core.mode(data));
    assertNumber(core.mode(dataF64));
    assertFiniteNumber(core.geomean([1, 2, 3]));
    assertNumber(core.skewness(data));
    assertNumber(core.kurtosis(data));
    assertNumber(core.coeffvar(data));
    assertNumber(core.meandev(data));
    assertNumber(core.meddev(data));
    assertNumber(core.stanMoment(data, 3));

    // Array-returning functions
    assertF64Array(core.cumsum(data));
    assertF64Array(core.cumsum(dataF64));
    assertF64Array(core.cumprod(data));
    assertF64Array(core.cumprod(dataF64));
    assertF64Array(core.diff(data));
    assertF64Array(core.diff(dataF64));
    assertF64Array(core.rank(data));
    assertF64Array(core.rank(dataF64));
    assertF64Array(core.deviation(data));
    assertF64Array(core.deviation(dataF64));

    // Empty branches
    assert.ok(Number.isNaN(core.min(empty)));
    assert.ok(Number.isNaN(core.max(empty)));
    assert.equal(core.sum(empty), 0);
    assertF64Array(core.rank(empty));
    assert.equal(core.rank(empty).length, 0);

    // Two-array functions
    assertNumber(core.covariance(data, data2));
    assertNumber(core.corrcoeff(data, data2));
    assertNumber(core.spearmancoeff(data, data2));
    assertNumber(core.covariance(dataF64, data2F64));
    assertNumber(core.corrcoeff(dataF64, data2F64));
    assertNumber(core.spearmancoeff(dataF64, data2F64));

    // Pooled stats
    assertNumber(core.pooledvariance([1, 2, 3], [2, 3, 4]));
    assertNumber(core.pooledstdev([1, 2, 3], [2, 3, 4]));

    // Descriptive snapshot
    const snap = core.descriptiveStats(data);
    assert.equal(typeof snap, 'object');
    assert.equal(snap.count, data.length);

    // Cumreduce (pure JS)
    const cumMax = core.cumreduce(data, -Infinity, (acc, x) => Math.max(acc, x));
    assertF64Array(cumMax);
    assert.equal(cumMax.length, data.length);
  });

  it('quantiles/histograms: inclusive/exclusive + edge cases', () => {
    const data = [10, 20, 30, 40, 50, 60];
    const dataF64 = Float64Array.from(data);

    // percentile has in-range and out-of-range branches
    assertNumber(core.percentile(data, 0.5, false));
    assertNumber(core.percentile(data, 0.5, true));
    assertNumber(core.percentile(dataF64, 0.5, false));
    assert.ok(Number.isNaN(core.percentile(data, -0.1)));
    assert.ok(Number.isNaN(core.percentile([], 0.5)));

    assertNumber(core.percentileOfScore(data, 30, false));
    assertNumber(core.percentileOfScore(data, 30, true));

    const qs = core.quantiles(data, [0.1, 0.5, 0.9]);
    assertF64Array(qs);
    assert.equal(qs.length, 3);
    assertF64Array(core.quantiles(dataF64, Float64Array.from([0.1, 0.5, 0.9])));

    const ps = core.percentiles(data, [0.25, 0.75]);
    assertF64Array(ps);
    assert.equal(ps.length, 2);

    const quart = core.quartiles(data);
    assert.ok(Array.isArray(quart));
    assert.equal(quart.length, 3);
    const [q1, q2, q3] = quart;
    assertNumber(q1);
    assertNumber(q2);
    assertNumber(q3);
    assertNumber(core.iqr(data));
    assert.ok(Number.isNaN(core.iqr([])));

    const h = core.histogram(data, 4);
    assertF64Array(h);
    assertF64Array(core.histogram(dataF64, 4));

    const edges = [0, 25, 50, 75];
    const h2 = core.histogramEdges(data, edges);
    assertF64Array(h2);
    assertF64Array(core.histogramEdges(dataF64, Float64Array.from(edges)));
  });

  it('statistical tests + regression: basic execution + error branches', () => {
    const data = [1, 2, 3, 4, 5, 6];

    const z = core.ztest(data, 0, 1);
    assert.equal(typeof z.statistic, 'number');
    assert.equal(typeof z.p_value, 'number');
    const zEmpty = core.ztest([], 0, 1);
    assert.ok(Number.isNaN(zEmpty.statistic));

    const t = core.ttest(data, 0);
    assert.equal(typeof t.statistic, 'number');
    assert.equal(typeof t.p_value, 'number');
    const tEmpty = core.ttest([], 0);
    assert.ok(Number.isNaN(tEmpty.statistic));

    const ciN = core.normalci(0.05, 10, 2);
    assert.equal(Array.isArray(ciN), true);
    assert.equal(ciN.length, 2);

    const ciT = core.tci(0.05, 10, 2, 12);
    assert.equal(Array.isArray(ciT), true);
    assert.equal(ciT.length, 2);

    const x = [1, 2, 3, 4];
    const y = [2, 4, 7, 9];

    // regress returns NaNs instead of throwing for invalid input
    const bad = core.regress([1, 2], [1]);
    assert.ok(Number.isNaN(bad.slope));
    const tooSmall = core.regress([1], [1]);
    assert.ok(Number.isNaN(tooSmall.slope));
    const r1 = core.regress(x, y);
    assertNumber(r1.slope);
    assertNumber(r1.intercept);
    assertNumber(r1.r_squared);
    assertF64Array(r1.residuals);

    // exercise alternate regression implementations
    const r2 = core.regressNaive(x, y);
    assertNumber(r2.r_squared);
    const r3 = core.regressSimd(x, y);
    assertNumber(r3.r_squared);
    const r4 = core.regressWasmKernels(x, y);
    assertNumber(r4.r_squared);

    // higher-level test helpers
    assertNumber(core.qscore(data, 10, false));
    assert.equal(typeof core.qtest(data, 10, 0.05, 0.95), 'boolean');
  });

  it('anova + chi-square: exercise key branches', () => {
    // anova: <2 groups branch
    assert.ok(Number.isNaN(core.anovaFScore([[1, 2, 3]])));
    // empty group branch
    assert.ok(Number.isNaN(core.anovaFScore([[1, 2], []])));

    const g1 = [1, 2, 3];
    const g2 = [2, 2, 4];
    const a = core.anovaTest([g1, g2]);
    assertNumber(a.fScore);
    assertNumber(a.dfBetween);
    assertNumber(a.dfWithin);

    const groups = ['A', 'A', 'B', 'B', 'B'];
    const values = [1, 2, 2, 4, 6];
    assertNumber(core.anovaFScoreCategorical(groups, values));
    const ac = core.anovaTestCategorical(groups, values);
    assertNumber(ac.fScore);

    // chi-square: mismatch branch + cardinality optimization branch
    assert.throws(() => core.chiSquareTest(['A'], ['A', 'B']), /same length/i);
    const chi1 = core.chiSquareTest(['M', 'M', 'F', 'F'], ['A', 'B', 'A', 'A']);
    assertNumber(chi1.statistic);
    assertNumber(chi1.pValue);
    assertNumber(chi1.df);

    const chi2 = core.chiSquareTest(['M', 'M', 'F', 'F'], ['A', 'B', 'A', 'A'], {
      cardinality1: 2,
      cardinality2: 2,
    });
    assertNumber(chi2.statistic);
  });

  it('distributions: construct + scalar + array methods', () => {
    const xs = Float64Array.from([0.1, 0.5, 0.9, 1.5]);
    const ks = Float64Array.from([0, 1, 2, 3]);

    const normals = [
      core.normal(),
      core.normal({ mean: 10, sd: 2 }),
    ];
    for (const d of normals) {
      assertNumber(d.pdf(0));
      assertNumber(d.cdf(0));
      assertNumber(d.inv(0.5));
      assertF64Array(d.pdfArray(xs));
      assertF64Array(d.cdfArray(xs));
    }
    // cover empty-array branches for distribution array methods
    assertF64Array(normals[0].pdfArray(new Float64Array()));
    assertF64Array(normals[0].cdfArray([]));

    // Cover rate-vs-scale branches
    const g1 = core.gamma({ shape: 2, rate: 3 });
    const g2 = core.gamma({ shape: 2, scale: 0.5 });
    assertNumber(g1.pdf(1));
    assertNumber(g2.cdf(1));

    const e1 = core.exponential({ rate: 2 });
    const e2 = core.exponential({ scale: 0.5 });
    assertNumber(e1.cdf(1));
    assertNumber(e2.pdf(1));

    // Common continuous distributions
    const cont = [
      core.beta({ alpha: 2, beta: 3 }),
      core.studentT({ mean: 0, scale: 1, dof: 3 }),
      core.chiSquared({ dof: 4 }),
      core.fisherF({ df1: 2, df2: 5 }),
      core.uniform({ min: -1, max: 2 }),
      core.cauchy({ local: 0, scale: 1 }),
      core.laplace({ mu: 0, b: 1 }),
      core.weibull({ scale: 1.5, shape: 2 }),
      core.pareto({ scale: 1, shape: 2 }),
      core.triangular({ min: 0, max: 2, mode: 0.5 }),
      core.inverseGamma({ shape: 2, scale: 1.5 }),
      core.logNormal({ mu: 0, sigma: 1 }),
    ];
    for (const d of cont) {
      assertNumber(d.pdf(0.5));
      assertNumber(d.cdf(0.5));
      assertNumber(d.inv(0.5));
      assertF64Array(d.pdfArray(xs));
      assertF64Array(d.cdfArray(xs));
    }
    assertF64Array(cont[0].pdfArray([]));
    assertF64Array(cont[0].cdfArray(new Float64Array()));

    // Discrete distributions
    const disc = [
      core.poisson({ lambda: 2 }),
      core.binomial({ n: 5, p: 0.4 }),
      core.negativeBinomial({ r: 3, p: 0.4 }),
    ];
    for (const d of disc) {
      assertNumber(d.pdf(2));
      assertNumber(d.cdf(2));
      assertNumber(d.inv(0.5));
      assertF64Array(d.pdfArray(ks));
      assertF64Array(d.cdfArray(ks));
    }
    assertF64Array(disc[0].pdfArray([]));
    assertF64Array(disc[0].cdfArray(new Float64Array()));
  });
});




