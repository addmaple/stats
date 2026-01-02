import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import {
  init,
  sum,
  mean,
  variance,
  min,
  max,
  median,
  deviation,
  histogram,
  quantiles,
  corrcoeff,
} from '@addmaple/stats';

function assertF64ArrayClose(actual, expected, eps = 1e-12) {
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < actual.length; i++) {
    const a = actual[i];
    const b = expected[i];
    if (Number.isNaN(a) || Number.isNaN(b)) {
      assert.ok(Number.isNaN(a) && Number.isNaN(b), `index ${i}: expected NaN`);
      continue;
    }
    assert.ok(Math.abs(a - b) <= eps, `index ${i}: ${a} vs ${b}`);
  }
}

describe('typed/array-like inputs', () => {
  before(async () => {
    await init();
  });

  it('accepts Float64Array and matches Array results', () => {
    const arr = [1, 2, 3, 4, 5];
    const f64 = Float64Array.from(arr);

    assert.equal(sum(f64), sum(arr));
    assert.equal(mean(f64), mean(arr));
    assert.equal(variance(f64), variance(arr));
    assert.equal(min(f64), min(arr));
    assert.equal(max(f64), max(arr));
    assert.equal(median(f64), median(arr));

    assertF64ArrayClose(deviation(f64), deviation(arr));
    assertF64ArrayClose(histogram(f64, 3), histogram(arr, 3));
    assertF64ArrayClose(quantiles(f64, [0.25, 0.5, 0.75]), quantiles(arr, [0.25, 0.5, 0.75]));
  });

  it('accepts other ArrayLike<number> (e.g. Float32Array)', () => {
    const arr = [1, 2, 3, 4, 5];
    const f32 = Float32Array.from(arr);

    assert.equal(sum(f32), sum(arr));
    assert.equal(mean(f32), mean(arr));
    assert.equal(variance(f32), variance(arr));
    assertF64ArrayClose(deviation(f32), deviation(arr));
  });

  it('accepts generic array-like objects', () => {
    const arr = [1, 2, 3, 4];
    const arrayLike = { 0: 1, 1: 2, 2: 3, 3: 4, length: 4 };

    assert.equal(sum(arrayLike), sum(arr));
    assert.equal(mean(arrayLike), mean(arr));
    assert.equal(variance(arrayLike), variance(arr));
    assertF64ArrayClose(quantiles(arrayLike, [0.5]), quantiles(arr, [0.5]));
  });

  it('works for two-array functions with typed arrays', () => {
    const x = Float64Array.from([1, 2, 3, 4]);
    const y = Float64Array.from([1, 3, 2, 5]);
    const xArr = Array.from(x);
    const yArr = Array.from(y);

    assert.equal(corrcoeff(x, y), corrcoeff(xArr, yArr));
  });
});






