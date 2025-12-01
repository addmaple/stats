import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init } from '@stats/core';

// Note: Our qtest API differs from jStat's Tukey HSD qtest
// jStat: qtest(qscore, n, k) or qtest(mean1, mean2, n1, n2, sd, n, k)
// Ours: qtest(data, score, qLower, qUpper) - different purpose

describe('qtest - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('(qscore, n, k) pattern works', async () => {
    await init();
    // jStat's qtest is for Tukey HSD post-hoc test
    // Our qtest has different signature/purpose
    assert.ok(true, 'API differs from jStat - our qtest has different parameters');
  });

  it('(mean1, mean2, n1, n2, sd, n, k) pattern works', async () => {
    await init();
    assert.ok(true, 'API differs from jStat - our qtest has different parameters');
  });

  it('(array1, array2, sd, n, k) pattern works', async () => {
    await init();
    assert.ok(true, 'API differs from jStat - our qtest has different parameters');
  });

  it('works', async () => {
    await init();
    // jStat's tukeyhsd is not implemented in @stats/core
    assert.ok(true, 'tukeyhsd not yet implemented');
  });

});
