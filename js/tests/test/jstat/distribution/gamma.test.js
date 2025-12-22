import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, gamma } from '@addmaple/stats';
import jStat from 'jstat';

// Converted from: gamma-test.js
describe('gamma - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  it.skip('check pdf (skipped: test needs manual conversion)', async () => {});

  it.skip('check cdf (skipped: test needs manual conversion)', async () => {});

  it.skip('check inv (skipped: test needs manual conversion)', async () => {});

});
