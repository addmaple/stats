import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  init,
  descriptiveStats,
  sum,
  mean,
  variance,
  sampleVariance,
  stdev,
  sampleStdev,
  min,
  max,
  range,
  median,
  quartiles,
  iqr,
} from '@stats/core';

describe('descriptiveStats helper', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('returns consistent core statistics', async () => {
    await init();

    const data = [1, 2, 3, 4, 5];
    const stats = descriptiveStats(data);

    assert.strictEqual(stats.count, data.length);
    assert.strictEqual(stats.sum, sum(data));
    assert.strictEqual(stats.mean, mean(data));
    assert.strictEqual(stats.variance, variance(data));
    assert.strictEqual(stats.sampleVariance, sampleVariance(data));
    assert.strictEqual(stats.stdev, stdev(data));
    assert.strictEqual(stats.sampleStdev, sampleStdev(data));
    assert.strictEqual(stats.min, min(data));
    assert.strictEqual(stats.max, max(data));
    assert.strictEqual(stats.range, range(data));

    const [q1, q2, q3] = quartiles(data);
    assert.strictEqual(stats.q1, q1);
    assert.strictEqual(stats.q2, q2);
    assert.strictEqual(stats.q3, q3);
    assert.strictEqual(stats.median, median(data));
    assert.strictEqual(stats.iqr, iqr(data));

    // Standard error should use sample stdev
    const expectedSe = sampleStdev(data) / Math.sqrt(data.length);
    assert.strictEqual(stats.standardError, expectedSe);
  });

  it('handles empty arrays', async () => {
    await init();

    const stats = descriptiveStats([]);

    assert.strictEqual(stats.count, 0);
    assert.strictEqual(stats.sum, 0);
    assert.ok(Number.isNaN(stats.mean));
    assert.ok(Number.isNaN(stats.variance));
    assert.ok(Number.isNaN(stats.sampleVariance));
    assert.ok(Number.isNaN(stats.stdev));
    assert.ok(Number.isNaN(stats.sampleStdev));
    assert.ok(Number.isNaN(stats.min));
    assert.ok(Number.isNaN(stats.max));
    assert.ok(Number.isNaN(stats.range));
    assert.ok(Number.isNaN(stats.median));
    assert.ok(Number.isNaN(stats.q1));
    assert.ok(Number.isNaN(stats.q2));
    assert.ok(Number.isNaN(stats.q3));
    assert.ok(Number.isNaN(stats.iqr));
    assert.ok(Number.isNaN(stats.standardError));
  });
});

