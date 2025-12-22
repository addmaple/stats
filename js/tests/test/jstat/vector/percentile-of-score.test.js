import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, percentileOfScore } from '@addmaple/stats';
import jStat from 'jstat';

const tol = 0.0000001;

// Converted from: percentile-of-score-test.js
describe('percentileOfScore - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('return basic percentile of score', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6];
    
    // Score = 3, expected = 0.5
    const jstatResult1 = jStat.percentileOfScore(data, 3);
    const ourResult1 = percentileOfScore(data, 3);
    assert.equal(ourResult1, jstatResult1);

    // Score = 5, expected ≈ 0.833
    const jstatResult2 = jStat.percentileOfScore(data, 5);
    const ourResult2 = percentileOfScore(data, 5);
    assert.ok(Math.abs(ourResult2 - jstatResult2) < tol,
      `Expected ~${jstatResult2}, got ${ourResult2}`);
  });

  it('return basic percentile of score: left extreme', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6];
    const jstatResult = jStat.percentileOfScore(data, -1);
    const ourResult = percentileOfScore(data, -1);

    assert.equal(ourResult, jstatResult);
  });

  it('return basic percentile of score: right extreme', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6];
    const jstatResult = jStat.percentileOfScore(data, 6);
    const ourResult = percentileOfScore(data, 6);

    assert.equal(ourResult, jstatResult);
  });

  it('return basic percentile of score (strict)', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6];
    // jStat uses 'strict' string, our API uses boolean
    const jstatResult = jStat.percentileOfScore(data, 5, 'strict');
    const ourResult = percentileOfScore(data, 5, true);

    assert.ok(Math.abs(ourResult - jstatResult) < tol,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

  it('percentile of score from instance', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6];
    const jstatResult = jStat(data).percentileOfScore(3);
    const ourResult = percentileOfScore(data, 3);

    assert.equal(ourResult, jstatResult);
  });

  it.skip('percentile of score matrix cols (skipped: matrix operations not implemented)', async () => {});

});
