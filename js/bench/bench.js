import {
  init,
  sum,
  mean,
  variance,
  stdev,
  min,
  max,
  product,
  range,
  median,
  mode,
  geomean,
  skewness,
  kurtosis,
  percentile,
  percentileOfScore,
  quartiles,
  iqr,
  covariance,
  corrcoeff,
  spearmancoeff,
  cumsum,
  cumprod,
  diff,
  rank,
  histogram,
  coeffvar,
  anovaFScore,
  poisson,
  binomial,
  ttest,
  ztest,
  regress,
  normalci,
  tci,
  chiSquareTest,
  deviation,
  meandev,
  meddev,
  pooledvariance,
  pooledstdev,
  stanMoment,
  qscore,
  qtest,
  cumreduce,
} from '@stats/core';
import jStat from 'jstat';

// Benchmark function
function benchmark(name, fn, iterations = 1000) {
  // Warmup
  for (let i = 0; i < 50; i++) {
    fn();
  }

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const avg = (end - start) / iterations;
  
  return { name, avg, total: end - start };
}

function compare(label, wasmFn, jstatFn, iterations = 1000) {
  const wasm = benchmark(`${label} (wasm)`, wasmFn, iterations);
  const js = benchmark(`${label} (jstat)`, jstatFn, iterations);
  const speedup = js.avg / wasm.avg;
  const status = speedup >= 1 ? '✓' : '✗';
  return `${status} ${label.padEnd(18)} wasm=${(wasm.avg * 1000).toFixed(2).padStart(8)}µs  jstat=${(js.avg * 1000).toFixed(2).padStart(8)}µs  ${speedup >= 1 ? 'speedup' : 'slowdown'}=${speedup.toFixed(2)}x`;
}

function compareInternal(label, fn1, fn2, iterations = 1000) {
  const result1 = benchmark(`${label} (approach 1)`, fn1, iterations);
  const result2 = benchmark(`${label} (approach 2)`, fn2, iterations);
  const speedup = result1.avg / result2.avg;
  const status = speedup >= 1 ? '✓' : '✗';
  return `${status} ${label.padEnd(30)} approach1=${(result1.avg * 1000).toFixed(2).padStart(8)}µs  approach2=${(result2.avg * 1000).toFixed(2).padStart(8)}µs  speedup=${speedup.toFixed(2)}x`;
}

async function runBenchmarks() {
  await init();

  console.log('Vector Statistics Performance: @stats/core (WASM) vs jStat\n');
  console.log('='.repeat(80));

  // Small array (100 elements)
  const small = Array.from({ length: 100 }, (_, i) => i + Math.random());
  const small2 = Array.from({ length: 100 }, (_, i) => i * 2 + Math.random());
  
  // Medium array (1000 elements)
  const medium = Array.from({ length: 1000 }, (_, i) => i + Math.random());
  const medium2 = Array.from({ length: 1000 }, (_, i) => i * 2 + Math.random());
  
  // Large array (10000 elements)
  const large = Array.from({ length: 10000 }, (_, i) => i + Math.random());
  const large2 = Array.from({ length: 10000 }, (_, i) => i * 2 + Math.random());

  // Mode test data (with repeated values)
  const modeData = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 100));

  console.log('\n--- Small Array (100 elements) ---');
  console.log(compare('sum', () => sum(small), () => jStat.sum(small)));
  console.log(compare('mean', () => mean(small), () => jStat.mean(small)));
  console.log(compare('variance', () => variance(small), () => jStat.variance(small)));
  console.log(compare('stdev', () => stdev(small), () => jStat.stdev(small)));
  console.log(compare('coeffvar', () => coeffvar(small), () => jStat.coeffvar(small)));
  console.log(compare('min', () => min(small), () => jStat.min(small)));
  console.log(compare('max', () => max(small), () => jStat.max(small)));
  console.log(compare('product', () => product(small.slice(0, 20)), () => jStat.product(small.slice(0, 20))));
  console.log(compare('range', () => range(small), () => jStat.range(small)));
  console.log(compare('median', () => median(small), () => jStat.median(small)));
  console.log(compare('geomean', () => geomean(small.map(x => x + 1)), () => jStat.geomean(small.map(x => x + 1))));
  console.log(compare('percentile', () => percentile(small, 0.5), () => jStat.percentile(small, 0.5)));
  console.log(compare('percentileOfScore', () => percentileOfScore(small, 5.0), () => jStat.percentileOfScore(small, 5.0)));
  console.log(compare('quartiles', () => quartiles(small), () => jStat.quartiles(small)));
  console.log(compare('iqr', () => iqr(small), () => jStat.quartiles(small)[2] - jStat.quartiles(small)[0]));
  console.log(compare('covariance', () => covariance(small, small2), () => jStat.covariance(small, small2)));
  console.log(compare('corrcoeff', () => corrcoeff(small, small2), () => jStat.corrcoeff(small, small2)));
  console.log(compare('spearmancoeff', () => spearmancoeff(small, small2), () => jStat.spearmancoeff(small, small2)));
  console.log(compare('cumsum', () => cumsum(small), () => jStat.cumsum(small)));
  console.log(compare('cumprod', () => cumprod(small.slice(0, 20)), () => jStat.cumprod(small.slice(0, 20))));
  console.log(compare('diff', () => diff(small), () => jStat.diff(small)));
  console.log(compare('rank', () => rank(small), () => jStat.rank(small)));
  console.log(compare('histogram', () => histogram(small, 10), () => jStat.histogram(small, 10)));
  console.log(compare('skewness', () => skewness(small), () => jStat.skewness(small)));
  console.log(compare('kurtosis', () => kurtosis(small), () => jStat.kurtosis(small)));
  
  const modeDataSmall = Array.from({ length: 100 }, () => Math.floor(Math.random() * 20));
  console.log(compare('mode', () => mode(modeDataSmall), () => jStat.mode(modeDataSmall)));
  
  // New functions
  console.log(compare('deviation', () => deviation(small), () => {
    const m = jStat.mean(small);
    return small.map(x => x - m);
  }));
  console.log(compare('meandev', () => meandev(small), () => jStat.meandev(small)));
  console.log(compare('meddev', () => meddev(small), () => {
    const med = jStat.median(small);
    return jStat.mean(small.map(x => Math.abs(x - med)));
  }));
  console.log(compare('pooledvariance', () => pooledvariance(small, small2), () => {
    const n1 = small.length;
    const n2 = small2.length;
    const var1 = jStat.variance(small);
    const var2 = jStat.variance(small2);
    return ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
  }));
  console.log(compare('pooledstdev', () => pooledstdev(small, small2), () => {
    const n1 = small.length;
    const n2 = small2.length;
    const var1 = jStat.variance(small);
    const var2 = jStat.variance(small2);
    const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    return Math.sqrt(pooledVar);
  }));
  console.log(compare('stanMoment(k=3)', () => stanMoment(small, 3), () => jStat.skewness(small)));
  console.log(compare('stanMoment(k=4)', () => stanMoment(small, 4), () => jStat.kurtosis(small)));
  console.log(compare('qscore', () => qscore(small, 5.0), () => jStat.percentileOfScore(small, 5.0)));
  console.log(compare('qtest', () => qtest(small, 5.0, 0.25, 0.75), () => {
    const qs = jStat.percentileOfScore(small, 5.0);
    return qs >= 0.25 && qs <= 0.75;
  }));
  console.log(compare('cumreduce(sum)', () => cumreduce(small, 0, (a, x) => a + x), () => jStat.cumsum(small)));
  console.log(compare('cumreduce(prod)', () => cumreduce(small.slice(0, 20), 1, (a, x) => a * x), () => jStat.cumprod(small.slice(0, 20))));

  console.log('\n--- Medium Array (1,000 elements) ---');
  console.log(compare('sum', () => sum(medium), () => jStat.sum(medium)));
  console.log(compare('mean', () => mean(medium), () => jStat.mean(medium)));
  console.log(compare('variance', () => variance(medium), () => jStat.variance(medium)));
  console.log(compare('stdev', () => stdev(medium), () => jStat.stdev(medium)));
  console.log(compare('coeffvar', () => coeffvar(medium), () => jStat.coeffvar(medium)));
  console.log(compare('min', () => min(medium), () => jStat.min(medium)));
  console.log(compare('max', () => max(medium), () => jStat.max(medium)));
  console.log(compare('product', () => product(medium.slice(0, 50)), () => jStat.product(medium.slice(0, 50))));
  console.log(compare('range', () => range(medium), () => jStat.range(medium)));
  console.log(compare('median', () => median(medium), () => jStat.median(medium)));
  console.log(compare('geomean', () => geomean(medium.map(x => x + 1)), () => jStat.geomean(medium.map(x => x + 1))));
  console.log(compare('percentile', () => percentile(medium, 0.5), () => jStat.percentile(medium, 0.5)));
  console.log(compare('percentileOfScore', () => percentileOfScore(medium, 500.0), () => jStat.percentileOfScore(medium, 500.0)));
  console.log(compare('quartiles', () => quartiles(medium), () => jStat.quartiles(medium)));
  console.log(compare('iqr', () => iqr(medium), () => jStat.quartiles(medium)[2] - jStat.quartiles(medium)[0]));
  console.log(compare('covariance', () => covariance(medium, medium2), () => jStat.covariance(medium, medium2)));
  console.log(compare('corrcoeff', () => corrcoeff(medium, medium2), () => jStat.corrcoeff(medium, medium2)));
  console.log(compare('spearmancoeff', () => spearmancoeff(medium, medium2), () => jStat.spearmancoeff(medium, medium2)));
  console.log(compare('cumsum', () => cumsum(medium), () => jStat.cumsum(medium)));
  console.log(compare('cumprod', () => cumprod(medium.slice(0, 50)), () => jStat.cumprod(medium.slice(0, 50))));
  console.log(compare('diff', () => diff(medium), () => jStat.diff(medium)));
  console.log(compare('rank', () => rank(medium), () => jStat.rank(medium)));
  console.log(compare('histogram', () => histogram(medium, 10), () => jStat.histogram(medium, 10)));
  console.log(compare('skewness', () => skewness(medium), () => jStat.skewness(medium)));
  console.log(compare('kurtosis', () => kurtosis(medium), () => jStat.kurtosis(medium)));
  console.log(compare('mode', () => mode(modeData), () => jStat.mode(modeData)));
  
  // New functions
  console.log(compare('deviation', () => deviation(medium), () => {
    const m = jStat.mean(medium);
    return medium.map(x => x - m);
  }));
  console.log(compare('meandev', () => meandev(medium), () => jStat.meandev(medium)));
  console.log(compare('meddev', () => meddev(medium), () => {
    const med = jStat.median(medium);
    return jStat.mean(medium.map(x => Math.abs(x - med)));
  }));
  console.log(compare('pooledvariance', () => pooledvariance(medium, medium2), () => {
    const n1 = medium.length;
    const n2 = medium2.length;
    const var1 = jStat.variance(medium);
    const var2 = jStat.variance(medium2);
    return ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
  }));
  console.log(compare('pooledstdev', () => pooledstdev(medium, medium2), () => {
    const n1 = medium.length;
    const n2 = medium2.length;
    const var1 = jStat.variance(medium);
    const var2 = jStat.variance(medium2);
    const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    return Math.sqrt(pooledVar);
  }));
  console.log(compare('stanMoment(k=3)', () => stanMoment(medium, 3), () => jStat.skewness(medium)));
  console.log(compare('stanMoment(k=4)', () => stanMoment(medium, 4), () => jStat.kurtosis(medium)));
  console.log(compare('qscore', () => qscore(medium, 500.0), () => jStat.percentileOfScore(medium, 500.0)));
  console.log(compare('qtest', () => qtest(medium, 500.0, 0.25, 0.75), () => {
    const qs = jStat.percentileOfScore(medium, 500.0);
    return qs >= 0.25 && qs <= 0.75;
  }));
  console.log(compare('cumreduce(sum)', () => cumreduce(medium, 0, (a, x) => a + x), () => jStat.cumsum(medium)));
  console.log(compare('cumreduce(prod)', () => cumreduce(medium.slice(0, 50), 1, (a, x) => a * x), () => jStat.cumprod(medium.slice(0, 50))));

  console.log('\n--- Large Array (10,000 elements) ---');
  console.log(compare('sum', () => sum(large), () => jStat.sum(large), 500));
  console.log(compare('mean', () => mean(large), () => jStat.mean(large), 500));
  console.log(compare('variance', () => variance(large), () => jStat.variance(large), 500));
  console.log(compare('stdev', () => stdev(large), () => jStat.stdev(large), 500));
  console.log(compare('coeffvar', () => coeffvar(large), () => jStat.coeffvar(large), 500));
  console.log(compare('min', () => min(large), () => jStat.min(large), 500));
  console.log(compare('max', () => max(large), () => jStat.max(large), 500));
  console.log(compare('product', () => product(large.slice(0, 100)), () => jStat.product(large.slice(0, 100)), 200));
  console.log(compare('range', () => range(large), () => jStat.range(large), 500));
  console.log(compare('median', () => median(large), () => jStat.median(large), 200));
  console.log(compare('geomean', () => geomean(large.map(x => x + 1)), () => jStat.geomean(large.map(x => x + 1)), 200));
  console.log(compare('percentile', () => percentile(large, 0.5), () => jStat.percentile(large, 0.5), 200));
  console.log(compare('percentileOfScore', () => percentileOfScore(large, 5000.0), () => jStat.percentileOfScore(large, 5000.0), 200));
  console.log(compare('quartiles', () => quartiles(large), () => jStat.quartiles(large), 200));
  console.log(compare('iqr', () => iqr(large), () => jStat.quartiles(large)[2] - jStat.quartiles(large)[0], 200));
  console.log(compare('covariance', () => covariance(large, large2), () => jStat.covariance(large, large2), 200));
  console.log(compare('corrcoeff', () => corrcoeff(large, large2), () => jStat.corrcoeff(large, large2), 200));
  console.log(compare('spearmancoeff', () => spearmancoeff(large, large2), () => jStat.spearmancoeff(large, large2), 200));
  console.log(compare('cumsum', () => cumsum(large), () => jStat.cumsum(large), 200));
  console.log(compare('cumprod', () => cumprod(large.slice(0, 100)), () => jStat.cumprod(large.slice(0, 100)), 200));
  console.log(compare('diff', () => diff(large), () => jStat.diff(large), 200));
  console.log(compare('rank', () => rank(large), () => jStat.rank(large), 200));
  console.log(compare('histogram', () => histogram(large, 10), () => jStat.histogram(large, 10), 200));
  console.log(compare('skewness', () => skewness(large), () => jStat.skewness(large), 200));
  console.log(compare('kurtosis', () => kurtosis(large), () => jStat.kurtosis(large), 200));
  
  // Mode test data for large array
  const modeDataLarge = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 100));
  console.log(compare('mode', () => mode(modeDataLarge), () => jStat.mode(modeDataLarge), 200));
  
  // New functions
  console.log(compare('deviation', () => deviation(large), () => {
    const m = jStat.mean(large);
    return large.map(x => x - m);
  }, 200));
  console.log(compare('meandev', () => meandev(large), () => jStat.meandev(large), 200));
  console.log(compare('meddev', () => meddev(large), () => {
    const med = jStat.median(large);
    return jStat.mean(large.map(x => Math.abs(x - med)));
  }, 200));
  console.log(compare('pooledvariance', () => pooledvariance(large, large2), () => {
    const n1 = large.length;
    const n2 = large2.length;
    const var1 = jStat.variance(large);
    const var2 = jStat.variance(large2);
    return ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
  }, 200));
  console.log(compare('pooledstdev', () => pooledstdev(large, large2), () => {
    const n1 = large.length;
    const n2 = large2.length;
    const var1 = jStat.variance(large);
    const var2 = jStat.variance(large2);
    const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    return Math.sqrt(pooledVar);
  }, 200));
  console.log(compare('stanMoment(k=3)', () => stanMoment(large, 3), () => jStat.skewness(large), 200));
  console.log(compare('stanMoment(k=4)', () => stanMoment(large, 4), () => jStat.kurtosis(large), 200));
  console.log(compare('qscore', () => qscore(large, 5000.0), () => jStat.percentileOfScore(large, 5000.0), 200));
  console.log(compare('qtest', () => qtest(large, 5000.0, 0.25, 0.75), () => {
    const qs = jStat.percentileOfScore(large, 5000.0);
    return qs >= 0.25 && qs <= 0.75;
  }, 200));
  console.log(compare('cumreduce(sum)', () => cumreduce(large, 0, (a, x) => a + x), () => jStat.cumsum(large), 200));
  console.log(compare('cumreduce(prod)', () => cumreduce(large.slice(0, 100), 1, (a, x) => a * x), () => jStat.cumprod(large.slice(0, 100)), 200));

  // ANOVA benchmarks
  console.log('\n--- ANOVA ---');
  const g1 = Array.from({ length: 100 }, (_, i) => i * 0.1 + Math.random());
  const g2 = Array.from({ length: 100 }, (_, i) => i * 0.1 + 5 + Math.random());
  const g3 = Array.from({ length: 100 }, (_, i) => i * 0.1 + 10 + Math.random());
  console.log(compare('anova (3x100)', () => anovaFScore([g1, g2, g3]), () => jStat.anovafscore(g1, g2, g3)));

  const groups = [];
  for (let g = 0; g < 5; g++) {
    groups.push(Array.from({ length: 1000 }, (_, i) => i * 0.01 + g * 10 + Math.random()));
  }
  console.log(compare('anova (5x1000)', () => anovaFScore(groups), () => jStat.anovafscore(...groups), 200));

  // Chi-Square Test benchmarks
  console.log('\n--- Chi-Square Test (10k elements) ---');
  
  // Generate 10k categorical arrays with different cardinalities
  const numCategories1 = 5;  // 5 unique categories
  const numCategories2 = 10; // 10 unique categories
  
  const cat1_10k = Array.from({ length: 10000 }, () => 
    `Cat1_${Math.floor(Math.random() * numCategories1)}`
  );
  const cat2_10k = Array.from({ length: 10000 }, () => 
    `Cat2_${Math.floor(Math.random() * numCategories2)}`
  );
  
  // Verify cardinalities
  const actualCard1 = new Set(cat1_10k).size;
  const actualCard2 = new Set(cat2_10k).size;
  console.log(`\nData: 10,000 elements, cat1 has ${actualCard1} unique values, cat2 has ${actualCard2} unique values\n`);
  
  // Compare HashMap approach (no cardinality) vs Array approach (with cardinality)
  console.log(compareInternal(
    'chi-square (HashMap vs Array)',
    () => chiSquareTest(cat1_10k, cat2_10k),
    () => chiSquareTest(cat1_10k, cat2_10k, { cardinality1: actualCard1, cardinality2: actualCard2 }),
    200
  ));
  
  // Also test with smaller cardinalities (2x2 table - most common case)
  const cat1_2x2 = Array.from({ length: 10000 }, () => 
    Math.random() < 0.5 ? 'A' : 'B'
  );
  const cat2_2x2 = Array.from({ length: 10000 }, () => 
    Math.random() < 0.5 ? 'X' : 'Y'
  );
  
  console.log('\n--- Chi-Square Test (10k elements, 2x2 table) ---');
  console.log(compareInternal(
    'chi-square 2x2 (HashMap vs Array)',
    () => chiSquareTest(cat1_2x2, cat2_2x2),
    () => chiSquareTest(cat1_2x2, cat2_2x2, { cardinality1: 2, cardinality2: 2 }),
    200
  ));
  
  // Test with larger cardinalities
  const numCategoriesLarge1 = 20;
  const numCategoriesLarge2 = 30;
  const cat1_large = Array.from({ length: 10000 }, () => 
    `Cat1_${Math.floor(Math.random() * numCategoriesLarge1)}`
  );
  const cat2_large = Array.from({ length: 10000 }, () => 
    `Cat2_${Math.floor(Math.random() * numCategoriesLarge2)}`
  );
  
  const actualCardLarge1 = new Set(cat1_large).size;
  const actualCardLarge2 = new Set(cat2_large).size;
  
  console.log('\n--- Chi-Square Test (10k elements, large table) ---');
  console.log(`Data: 10,000 elements, cat1 has ${actualCardLarge1} unique values, cat2 has ${actualCardLarge2} unique values\n`);
  console.log(compareInternal(
    'chi-square large (HashMap vs Array)',
    () => chiSquareTest(cat1_large, cat2_large),
    () => chiSquareTest(cat1_large, cat2_large, { cardinality1: actualCardLarge1, cardinality2: actualCardLarge2 }),
    200
  ));

  // Distribution benchmarks
  console.log('\n--- Distributions: Poisson ---');
  const poissDist = poisson({ lambda: 3 });
  const poissJStat = jStat.poisson(3);
  const poissValues = Array.from({ length: 100 }, (_, i) => i);
  
  console.log(compare('poisson.pdf(5)', () => poissDist.pdf(5), () => poissJStat.pdf(5)));
  console.log(compare('poisson.cdf(10)', () => poissDist.cdf(10), () => poissJStat.cdf(10)));
  console.log(compare('poisson.pdfArray(100)', () => poissDist.pdfArray(poissValues), () => {
    const result = new Float64Array(100);
    for (let i = 0; i < 100; i++) {
      result[i] = poissJStat.pdf(i);
    }
    return result;
  }));
  console.log(compare('poisson.cdfArray(100)', () => poissDist.cdfArray(poissValues), () => {
    const result = new Float64Array(100);
    for (let i = 0; i < 100; i++) {
      result[i] = poissJStat.cdf(i);
    }
    return result;
  }));

  const poissValuesLarge = Array.from({ length: 1000 }, (_, i) => i);
  console.log(compare('poisson.pdfArray(1000)', () => poissDist.pdfArray(poissValuesLarge), () => {
    const result = new Float64Array(1000);
    for (let i = 0; i < 1000; i++) {
      result[i] = poissJStat.pdf(i);
    }
    return result;
  }, 200));
  console.log(compare('poisson.cdfArray(1000)', () => poissDist.cdfArray(poissValuesLarge), () => {
    const result = new Float64Array(1000);
    for (let i = 0; i < 1000; i++) {
      result[i] = poissJStat.cdf(i);
    }
    return result;
  }, 200));

  console.log('\n--- Distributions: Binomial ---');
  const binomDist = binomial({ n: 20, p: 0.5 });
  const binomJStat = jStat.binomial(20, 0.5); // jStat uses (n, p) order
  const binomValues = Array.from({ length: 21 }, (_, i) => i); // 0 to 20
  
  console.log(compare('binomial.pdf(10)', () => binomDist.pdf(10), () => binomJStat.pdf(10)));
  console.log(compare('binomial.cdf(15)', () => binomDist.cdf(15), () => binomJStat.cdf(15)));
  console.log(compare('binomial.pdfArray(21)', () => binomDist.pdfArray(binomValues), () => {
    const result = new Float64Array(21);
    for (let i = 0; i < 21; i++) {
      result[i] = binomJStat.pdf(i);
    }
    return result;
  }));
  console.log(compare('binomial.cdfArray(21)', () => binomDist.cdfArray(binomValues), () => {
    const result = new Float64Array(21);
    for (let i = 0; i < 21; i++) {
      result[i] = binomJStat.cdf(i);
    }
    return result;
  }));

  // Test with larger n
  const binomLargeDist = binomial({ n: 100, p: 0.3 });
  const binomLargeJStat = jStat.binomial(100, 0.3);
  const binomLargeValues = Array.from({ length: 101 }, (_, i) => i);
  console.log(compare('binomial.pdfArray(101)', () => binomLargeDist.pdfArray(binomLargeValues), () => {
    const result = new Float64Array(101);
    for (let i = 0; i < 101; i++) {
      result[i] = binomLargeJStat.pdf(i);
    }
    return result;
  }, 200));
  console.log(compare('binomial.cdfArray(101)', () => binomLargeDist.cdfArray(binomLargeValues), () => {
    const result = new Float64Array(101);
    for (let i = 0; i < 101; i++) {
      result[i] = binomLargeJStat.cdf(i);
    }
    return result;
  }, 200));

  // Statistical Tests and Confidence Intervals
  console.log('\n--- Statistical Tests ---');
  const testSample = Array.from({ length: 100 }, (_, i) => i + Math.random());
  const testSampleMean = jStat.mean(testSample);
  const testSampleStdev = jStat.stdev(testSample);
  
  // ttest - jStat returns NaN but we can benchmark the calculation
  console.log(compare('ttest (100)', () => ttest(testSample, testSampleMean), () => {
    // Mock jStat implementation for benchmarking
    const n = testSample.length;
    const mean = testSampleMean;
    const stdev = testSampleStdev;
    const se = stdev / Math.sqrt(n);
    const t = (mean - testSampleMean) / se;
    return { statistic: t, p_value: 0.5, df: n - 1 };
  }));
  
  // ztest
  console.log(compare('ztest (100)', () => ztest(testSample, testSampleMean, testSampleStdev), () => {
    // Mock jStat implementation
    const n = testSample.length;
    const mean = testSampleMean;
    const sigma = testSampleStdev;
    const se = sigma / Math.sqrt(n);
    const z = (mean - testSampleMean) / se;
    return { statistic: z, p_value: 0.5, df: null };
  }));
  
  // regress - jStat doesn't work, so we'll compare against a simple JS implementation
  const regressX = Array.from({ length: 100 }, (_, i) => i);
  const regressY = Array.from({ length: 100 }, (_, i) => i * 2 + Math.random());
  console.log(compare('regress (100)', () => regress(regressX, regressY), () => {
    // Simple JS regression implementation for comparison
    const n = regressX.length;
    const xMean = regressX.reduce((a, b) => a + b, 0) / n;
    const yMean = regressY.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (regressX[i] - xMean) * (regressY[i] - yMean);
      den += (regressX[i] - xMean) ** 2;
    }
    const slope = num / den;
    const intercept = yMean - slope * xMean;
    const residuals = regressY.map((y, i) => y - (slope * regressX[i] + intercept));
    let ssRes = 0, ssTot = 0;
    for (let i = 0; i < n; i++) {
      ssRes += residuals[i] ** 2;
      ssTot += (regressY[i] - yMean) ** 2;
    }
    const rSquared = 1 - (ssRes / ssTot);
    return { slope, intercept, r_squared: rSquared, residuals: new Float64Array(residuals) };
  }));
  
  // Larger regress test
  const regressXLarge = Array.from({ length: 1000 }, (_, i) => i);
  const regressYLarge = Array.from({ length: 1000 }, (_, i) => i * 2 + Math.random());
  console.log(compare('regress (1000)', () => regress(regressXLarge, regressYLarge), () => {
    const n = regressXLarge.length;
    const xMean = regressXLarge.reduce((a, b) => a + b, 0) / n;
    const yMean = regressYLarge.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (regressXLarge[i] - xMean) * (regressYLarge[i] - yMean);
      den += (regressXLarge[i] - xMean) ** 2;
    }
    const slope = num / den;
    const intercept = yMean - slope * xMean;
    const residuals = regressYLarge.map((y, i) => y - (slope * regressXLarge[i] + intercept));
    let ssRes = 0, ssTot = 0;
    for (let i = 0; i < n; i++) {
      ssRes += residuals[i] ** 2;
      ssTot += (regressYLarge[i] - yMean) ** 2;
    }
    const rSquared = 1 - (ssRes / ssTot);
    return { slope, intercept, r_squared: rSquared, residuals: new Float64Array(residuals) };
  }, 200));

  console.log('\n--- Confidence Intervals ---');
  // normalci
  const se = testSampleStdev / Math.sqrt(testSample.length);
  console.log(compare('normalci', () => normalci(0.05, testSampleMean, se), () => {
    // Mock jStat implementation
    const z = 1.96; // z-score for 95% CI
    return [testSampleMean - z * se, testSampleMean + z * se];
  }));
  
  // tci
  console.log(compare('tci', () => tci(0.05, testSampleMean, testSampleStdev, testSample.length), () => {
    // Mock jStat implementation - using approximate t-value
    const n = testSample.length;
    const df = n - 1;
    const t = df > 30 ? 1.96 : 2.0; // Approximate t-value
    const se = testSampleStdev / Math.sqrt(n);
    return [testSampleMean - t * se, testSampleMean + t * se];
  }));

  console.log('\n' + '='.repeat(80));
  
  // Summary
  console.log('\nLegend: ✓ = faster than jStat, ✗ = slower than jStat');
  console.log('Note: Some functions (min/max/range) use pure JS for small arrays due to copy overhead.');
  console.log('Note: jStat regress/ttest/ztest may return NaN - benchmarks compare against equivalent JS implementations.');
}

runBenchmarks().catch(console.error);
