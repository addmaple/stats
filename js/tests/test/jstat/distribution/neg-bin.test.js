import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init } from '@addmaple/stats';
import jStat from 'jstat';

// Generated from: negbin-test.js
// TODO: Import the function(s) you need from '@addmaple/stats'
// TODO: Convert jstat test cases below to use our API

describe('negbin - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  // Original jstat assertions found:



  // TODO: Add test cases here
  // Example:
  // it('basic test', async () => {
  //   await init();
  //   const data = [1, 2, 3];
  //   const jstatResult = jStat.negbin(data);
  //   const ourResult = negbin(data); // Import this function
  //   assert.equal(ourResult, jstatResult);
  // });
});
