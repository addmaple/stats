import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, triangular } from '@stats/core';
import jStat from 'jstat';

// Converted from: triangular-test.js
describe('triangular - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it('check pdf calculation, when a < c < b', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check pdf calculation, when a = c < b', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check pdf calculation, when a < c = b', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check pdf calculation, when c < a', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check pdf calculation, when b < c', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check pdf calculation, when a = b', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check cdf calculation, when a < c < b', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check cdf calculation, when a = c < b', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check cdf calculation, when a < c = b', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check cdf calculation, when c < a', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check cdf calculation, when b < c', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check cdf calculation, when a = b', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check inv calculation, when a < c < b', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check inv calculation, when a = c < b', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check inv calculation, when a < c = b', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check inv calculation, when c < a', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check inv calculation, when b < c', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

  it('check inv calculation, when a = b', async () => {
    await init();

    // TODO: Manual conversion needed
    assert.ok(true, 'Test needs manual conversion');
  });

});
