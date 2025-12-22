import { init, mean, variance, spearmancoeff, ttest } from '../../dist/index.js';

async function runExample() {
  console.log('--- @addmaple/stats Node.js Example ---');

  // Initialize the WASM module
  // By default, it loads the separate .wasm file.
  // Use { inline: true } to use the embedded version.
  console.log('Initializing WASM...');
  await init();
  console.log('WASM loaded successfully.\n');

  // 1. Basic Vector Statistics
  const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  console.log('Data:', data);
  console.log('Mean:', mean(data));         // 55
  console.log('Variance:', variance(data)); // 825
  console.log('');

  // 2. Correlation
  const x = [1, 2, 3, 4, 5];
  const y = [2, 4, 5, 4, 5];
  console.log('X:', x);
  console.log('Y:', y);
  console.log('Spearman Correlation:', spearmancoeff(x, y).toFixed(4));
  console.log('');

  // 3. Statistical Tests
  const sample = [5.1, 4.9, 5.2, 4.8, 5.0, 5.3, 4.7];
  const mu0 = 5.0;
  const result = ttest(sample, mu0);
  console.log(`One-sample T-Test (mu0=${mu0}):`);
  console.log(`  Statistic: ${result.statistic.toFixed(4)}`);
  console.log(`  P-Value:   ${result.p_value.toFixed(4)}`);
  console.log(`  DF:        ${result.df}`);
  console.log('');

  console.log('--- Example Finished ---');
}

runExample().catch(err => {
  console.error('Error running example:', err);
  process.exit(1);
});

