import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, percentile } from '@addmaple/stats';
import jStat from 'jstat';

// Converted from: percentile-test.js
describe('percentile - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('30th percentile of the list in the range', async () => {
    await init();

    const data = [1, 2, 3, 4];
    const jstatResult = jStat.percentile(data, 0.3);
    const ourResult = percentile(data, 0.3);

    assert.equal(ourResult, jstatResult);
  });

  it('30th percentile of the list in the range with exclusive flag true', async () => {
    await init();

    const data = [1, 2, 3, 4];
    const jstatResult = jStat.percentile(data, 0.3, true);
    const ourResult = percentile(data, 0.3, true);

    assert.equal(ourResult, jstatResult);
  });

  it('30th percentile of the list in the range, unsorted', async () => {
    await init();

    const data = [3, 1, 4, 2];
    const jstatResult = jStat.percentile(data, 0.3);
    const ourResult = percentile(data, 0.3);

    assert.equal(ourResult, jstatResult);
  });

  it('40th percentile of the list in the range with exclusive flag false', async () => {
    await init();

    const data = [15, 20, 35, 40, 50];
    const jstatResult = jStat.percentile(data, 0.4, false);
    const ourResult = percentile(data, 0.4, false);

    assert.ok(Math.abs(ourResult - jstatResult) < 0.0000001,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

  it('40th percentile of the list in the range with exclusive flag true', async () => {
    await init();

    const data = [15, 20, 35, 40, 50];
    const jstatResult = jStat.percentile(data, 0.4, true);
    const ourResult = percentile(data, 0.4, true);

    assert.ok(Math.abs(ourResult - jstatResult) < 0.0000001,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

  it('10th percentile of the list in the range with exclusive flag false', async () => {
    await init();

    const data = [15, 20, 35, 40, 50];
    const jstatResult = jStat.percentile(data, 0.1, false);
    const ourResult = percentile(data, 0.1, false);

    assert.ok(Math.abs(ourResult - jstatResult) < 0.0000001,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

  it('100th percentile of the list in the range with exclusive flag false', async () => {
    await init();

    const data = [15, 20, 35, 40, 50];
    const jstatResult = jStat.percentile(data, 1, false);
    const ourResult = percentile(data, 1, false);

    assert.ok(Math.abs(ourResult - jstatResult) < 0.0000001,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

});
