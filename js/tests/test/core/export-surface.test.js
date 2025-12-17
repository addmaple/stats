import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import * as core from '@stats/core';

function isFn(x) {
  return typeof x === 'function';
}

describe('export surface smoke (coverage)', () => {
  before(async () => {
    await core.init();
  });

  it('exercises every exported function at least once', () => {
    const data = [1, 2, 3, 4, 5];
    const data2 = [2, 3, 1, 0, 4];

    // Stats
    core.sum(data);
    core.mean(data);
    core.variance(data);
    core.sampleVariance(data);
    core.stdev(data);
    core.sampleStdev(data);
    core.min(data);
    core.max(data);
    core.product(data);
    core.range(data);
    core.median(data);
    core.mode(data);
    core.geomean([1, 2, 3]);
    core.skewness(data);
    core.kurtosis(data);
    core.coeffvar(data);
    core.meandev(data);
    core.meddev(data);
    core.stanMoment(data, 2);

    // Arrays
    core.cumsum(data);
    core.cumprod(data);
    core.diff(data);
    core.rank(data);
    core.deviation(data);
    core.cumreduce(data, 0, (acc, x) => acc + x);

    // Correlation / covariance
    core.covariance(data, data2);
    core.corrcoeff(data, data2);
    core.spearmancoeff(data, data2);
    core.pooledvariance([1, 2, 3], [2, 3, 4]);
    core.pooledstdev([1, 2, 3], [2, 3, 4]);

    // Quantiles
    core.percentile(data, 0.5, false);
    core.percentile(data, 0.5, true);
    core.percentileOfScore(data, 3, false);
    core.percentileOfScore(data, 3, true);
    core.percentiles(data, [0.25, 0.75]);
    core.quantiles(data, [0.1, 0.5, 0.9]);
    core.quartiles(data);
    core.iqr(data);
    core.histogram(data, 4);
    core.histogramEdges(data, [0, 2, 4, 6]);
    core.histogramBinning(data, { mode: 'fixedWidth', bins: 5 });
    core.histogramBinning(data, { mode: 'equalFrequency', bins: 4 });
    core.histogramBinning(data, { mode: 'auto', rule: 'FD' });
    core.histogramBinning(data, { mode: 'custom', edges: [0, 2, 4, 6] });
    core.BinningPresets.autoFD();
    core.BinningPresets.equalFrequency(5);

    // Statistical tests
    core.ttest(data, 3);
    core.ztest(data, 3, 1);
    core.qscore(data, 3, false);
    core.qscore(data, 3, true);
    core.qtest(data, 3, 0.1, 0.9);
    core.normalci(0.05, 10, 2);
    core.tci(0.05, 10, 2, 10);

    // Regression
    core.regress([1, 2, 3, 4], [2, 4, 6, 9]);
    core.regressNaive([1, 2, 3, 4], [2, 4, 6, 9]);
    core.regressSimd([1, 2, 3, 4], [2, 4, 6, 9]);
    core.regressWasmKernels([1, 2, 3, 4], [2, 4, 6, 9]);

    // ANOVA + Chi-square
    core.anovaFScore([[1, 2, 3], [2, 3, 4]]);
    core.anovaTest([[1, 2, 3], [2, 3, 4]]);
    core.anovaFScoreCategorical(['A', 'A', 'B', 'B'], [1, 2, 2, 3]);
    core.anovaTestCategorical(['A', 'A', 'B', 'B'], [1, 2, 2, 3]);
    core.chiSquareTest(['M', 'M', 'F', 'F'], ['A', 'B', 'A', 'A']);
    core.chiSquareTest(['M', 'M', 'F', 'F'], ['A', 'B', 'A', 'A'], { cardinality1: 2, cardinality2: 2 });

    // Distributions (construct + scalar methods)
    const xs = [0.1, 0.5, 1.0];
    const xsF64 = Float64Array.from(xs);
    const distCtors = [
      // defaults
      () => core.normal(),
      () => core.gamma(),
      () => core.beta(),
      () => core.studentT(),
      () => core.chiSquared(),
      () => core.fisherF(),
      () => core.exponential(),
      () => core.poisson(),
      () => core.binomial(),
      () => core.uniform(),
      () => core.cauchy(),
      () => core.laplace(),
      () => core.weibull(),
      () => core.pareto(),
      () => core.triangular(),
      () => core.inverseGamma(),
      () => core.logNormal(),
      () => core.negativeBinomial(),

      // non-default shapes / alternate param forms
      () => core.gamma({ shape: 2, rate: 3 }),
      () => core.gamma({ shape: 2, scale: 0.5 }),
      () => core.beta({ alpha: 2, beta: 3 }),
      () => core.studentT({ mean: 0, scale: 1, dof: 3 }),
      () => core.chiSquared({ dof: 4 }),
      () => core.fisherF({ df1: 2, df2: 5 }),
      () => core.exponential({ rate: 2 }),
      () => core.exponential({ scale: 0.5 }),
      () => core.poisson({ lambda: 2 }),
      () => core.binomial({ n: 5, p: 0.4 }),
      () => core.uniform({ min: -1, max: 2 }),
      () => core.cauchy({ local: 0, scale: 1 }),
      () => core.laplace({ mu: 0, b: 1 }),
      () => core.weibull({ scale: 1.5, shape: 2 }),
      () => core.pareto({ scale: 1, shape: 2 }),
      () => core.triangular({ min: 0, max: 2, mode: 0.5 }),
      () => core.triangular({ min: 0, max: 2 }),
      () => core.inverseGamma({ shape: 2, rate: 1.5 }),
      () => core.logNormal({ mu: 0, sigma: 1 }),
      () => core.negativeBinomial({ r: 3, p: 0.4 }),
    ];

    for (const mk of distCtors) {
      const d = mk();
      assert.ok(d && typeof d === 'object');
      assert.ok(isFn(d.pdf));
      assert.ok(isFn(d.cdf));
      assert.ok(isFn(d.inv));
      d.pdf(xs[0]);
      d.cdf(xs[1]);
      d.inv(0.5);
      // Array methods should exist for continuous distributions; discrete too.
      if (isFn(d.pdfArray)) d.pdfArray(xsF64);
      if (isFn(d.cdfArray)) d.cdfArray(xsF64);
    }

    // Ensure the module exports are stable
    for (const [k, v] of Object.entries(core)) {
      // Everything exported should be a function for this package, except BinningPresets which is an object
      if (k === 'BinningPresets') {
        assert.ok(typeof v === 'object' && v !== null, `export ${k} should be an object`);
      } else {
        assert.ok(typeof v === 'function', `export ${k} is not a function`);
      }
    }
  });
});




