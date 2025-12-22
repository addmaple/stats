import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, kurtosis } from '@addmaple/stats';
import jStat from 'jstat';

// Converted from: kurtosis-test.js
describe('kurtosis - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('returns accurate kurtosis value', async () => {
    await init();

    const data = [
        -0.28157961, -0.75577350,  0.61554139,  0.26864022, -0.42703435, -0.99927791,
        -0.07113527, -1.39327183,  0.34871138,  1.17909042, -0.22951562,  0.22341714];
    const jstatResult = jStat.kurtosis(data);
    const ourResult = kurtosis(data);

    // jstat expects: -0.51157 < kurt < -0.51155
    assert.ok(ourResult > -0.51157, `Expected > -0.51157, got ${ourResult}`);
    assert.ok(ourResult < -0.51155, `Expected < -0.51155, got ${ourResult}`);
    // Also compare with jstat result
    assert.ok(Math.abs(ourResult - jstatResult) < 1e-5,
      `Expected ~${jstatResult}, got ${ourResult}`);
  });

  it('kurtosis from instance', async () => {
    await init();

    const data = [
        -0.28157961, -0.75577350,  0.61554139,  0.26864022, -0.42703435, -0.99927791,
        -0.07113527, -1.39327183,  0.34871138,  1.17909042, -0.22951562,  0.22341714];
    const jstatResult = jStat(data).kurtosis();
    const ourResult = kurtosis(data);

    assert.ok(ourResult > -0.51157);
    assert.ok(ourResult < -0.51155);
    assert.ok(Math.abs(ourResult - jstatResult) < 1e-5);
  });

});
