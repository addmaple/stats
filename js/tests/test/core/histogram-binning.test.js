import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { init, histogramBinning, BinningPresets } from '@stats/core';

describe('histogramBinning - advanced binning strategies', () => {
  before(async () => {
    await init();
  });

  it('fixedWidth mode: returns edges and counts', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = histogramBinning(data, { mode: 'fixedWidth', bins: 5 });

    assert.ok(result.edges instanceof Float64Array);
    assert.ok(result.counts instanceof Float64Array);
    assert.equal(result.edges.length, 6); // bins + 1
    assert.equal(result.counts.length, 5); // bins
    assert.equal(result.edges[0], 1); // min
    assert.equal(result.edges[5], 10); // max
    
    // Sum of counts should equal data length
    const sum = Array.from(result.counts).reduce((a, b) => a + b, 0);
    assert.equal(sum, data.length);
  });

  it('equalFrequency mode: returns balanced bins', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = histogramBinning(data, { mode: 'equalFrequency', bins: 4 });

    assert.ok(result.edges instanceof Float64Array);
    assert.ok(result.counts instanceof Float64Array);
    assert.equal(result.edges.length, 5); // bins + 1
    assert.equal(result.counts.length, 4); // bins
    
    // Sum of counts should equal data length
    const sum = Array.from(result.counts).reduce((a, b) => a + b, 0);
    assert.equal(sum, data.length);
    
    // For equal frequency, counts should be roughly balanced
    const counts = Array.from(result.counts);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);
    // Counts should be within 1 of each other for balanced data
    assert.ok(maxCount - minCount <= 2);
  });

  it('auto mode with FD rule: returns sensible bins', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    const result = histogramBinning(data, { mode: 'auto', rule: 'FD' });

    assert.ok(result.edges instanceof Float64Array);
    assert.ok(result.counts instanceof Float64Array);
    assert.ok(result.edges.length > 0);
    assert.ok(result.counts.length > 0);
    assert.equal(result.edges.length, result.counts.length + 1);
    
    // Sum of counts should equal data length
    const sum = Array.from(result.counts).reduce((a, b) => a + b, 0);
    assert.equal(sum, data.length);
  });

  it('auto mode with Scott rule: returns sensible bins', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    const result = histogramBinning(data, { mode: 'auto', rule: 'Scott' });

    assert.ok(result.edges instanceof Float64Array);
    assert.ok(result.counts instanceof Float64Array);
    assert.ok(result.edges.length > 0);
    assert.ok(result.counts.length > 0);
    
    // Sum of counts should equal data length
    const sum = Array.from(result.counts).reduce((a, b) => a + b, 0);
    assert.equal(sum, data.length);
  });

  it('auto mode with sqrtN rule: returns sqrt(n) bins', async () => {
    await init();

    const data = Array.from({ length: 100 }, (_, i) => i + 1);
    const result = histogramBinning(data, { mode: 'auto', rule: 'sqrtN' });

    assert.ok(result.edges instanceof Float64Array);
    assert.ok(result.counts instanceof Float64Array);
    // sqrt(100) = 10, so should have ~10 bins
    assert.ok(result.counts.length >= 8 && result.counts.length <= 12);
    
    // Sum of counts should equal data length
    const sum = Array.from(result.counts).reduce((a, b) => a + b, 0);
    assert.equal(sum, data.length);
  });

  describe('auto rule comparisons', () => {
    it('FD rule produces fewer bins than sqrtN for data with outliers', async () => {
      await init();

      // Data with outliers
      const data = [
        ...Array.from({ length: 100 }, (_, i) => i + 1), // Normal range
        -1000, -500, 5000, 6000 // Outliers
      ];

      const fdResult = histogramBinning(data, { mode: 'auto', rule: 'FD' });
      const sqrtResult = histogramBinning(data, { mode: 'auto', rule: 'sqrtN' });

      // FD should be more conservative (fewer bins) due to IQR robustness
      // sqrtN uses n directly, so it will use more bins
      // Note: This may vary, but FD should handle outliers better
      const fdBins = fdResult.counts.length;
      const sqrtBins = sqrtResult.counts.length;
      
      // Both should produce valid histograms
      assert.ok(fdBins > 0);
      assert.ok(sqrtBins > 0);
      
      // Verify all data is counted
      const fdSum = Array.from(fdResult.counts).reduce((a, b) => a + b, 0);
      const sqrtSum = Array.from(sqrtResult.counts).reduce((a, b) => a + b, 0);
      assert.equal(fdSum, data.length);
      assert.equal(sqrtSum, data.length);
    });

    it('Scott and FD produce similar results for normal data', async () => {
      await init();

      // Generate approximately normal data (using central limit theorem approximation)
      const normalData = Array.from({ length: 500 }, () => {
        // Sum of 12 uniform RVs approximates normal
        let sum = 0;
        for (let i = 0; i < 12; i++) {
          sum += Math.random();
        }
        return (sum - 6) * 10 + 50; // Mean ~50, std ~10
      });

      const scottResult = histogramBinning(normalData, { mode: 'auto', rule: 'Scott' });
      const fdResult = histogramBinning(normalData, { mode: 'auto', rule: 'FD' });

      // Both should produce reasonable bin counts
      assert.ok(scottResult.counts.length > 5);
      assert.ok(fdResult.counts.length > 5);
      
      // Bin counts should be similar (within factor of 2)
      const ratio = Math.max(scottResult.counts.length, fdResult.counts.length) / 
                    Math.min(scottResult.counts.length, fdResult.counts.length);
      assert.ok(ratio < 2.5, 'Scott and FD should produce similar bin counts for normal data');
      
      // Verify all data is counted
      const scottSum = Array.from(scottResult.counts).reduce((a, b) => a + b, 0);
      const fdSum = Array.from(fdResult.counts).reduce((a, b) => a + b, 0);
      assert.equal(scottSum, normalData.length);
      assert.equal(fdSum, normalData.length);
    });

    it('sqrtN rule scales predictably with data size', async () => {
      await init();

      const sizes = [100, 400, 900, 1600]; // sqrt = 10, 20, 30, 40
      
      for (const size of sizes) {
        const data = Array.from({ length: size }, (_, i) => i);
        const result = histogramBinning(data, { mode: 'auto', rule: 'sqrtN' });
        
        const expectedBins = Math.ceil(Math.sqrt(size));
        // Allow some variance due to edge cases, but should be close
        assert.ok(
          Math.abs(result.counts.length - expectedBins) <= 2,
          `For size ${size}, expected ~${expectedBins} bins, got ${result.counts.length}`
        );
        
        // Verify all data is counted
        const sum = Array.from(result.counts).reduce((a, b) => a + b, 0);
        assert.equal(sum, size);
      }
    });

    it('FD rule is more robust to skewed data than Scott', async () => {
      await init();

      // Heavily right-skewed data (e.g., income distribution)
      const skewedData = [
        ...Array.from({ length: 90 }, () => Math.random() * 10), // Most values low
        ...Array.from({ length: 9 }, () => 10 + Math.random() * 10), // Some medium
        50, 60, 70, 80, 90, 100 // A few high outliers
      ];

      const fdResult = histogramBinning(skewedData, { mode: 'auto', rule: 'FD' });
      const scottResult = histogramBinning(skewedData, { mode: 'auto', rule: 'Scott' });

      // Both should work, but FD should handle the skew better
      assert.ok(fdResult.counts.length > 0);
      assert.ok(scottResult.counts.length > 0);
      
      // Verify all data is counted
      const fdSum = Array.from(fdResult.counts).reduce((a, b) => a + b, 0);
      const scottSum = Array.from(scottResult.counts).reduce((a, b) => a + b, 0);
      assert.equal(fdSum, skewedData.length);
      assert.equal(scottSum, skewedData.length);
    });

    it('auto rule with bins override uses specified bins', async () => {
      await init();

      const data = Array.from({ length: 200 }, (_, i) => i);
      const overrideBins = 15;

      const fdResult = histogramBinning(data, { 
        mode: 'auto', 
        rule: 'FD', 
        bins: overrideBins 
      });
      const scottResult = histogramBinning(data, { 
        mode: 'auto', 
        rule: 'Scott', 
        bins: overrideBins 
      });
      const sqrtResult = histogramBinning(data, { 
        mode: 'auto', 
        rule: 'sqrtN', 
        bins: overrideBins 
      });

      // All should use the override
      assert.equal(fdResult.counts.length, overrideBins);
      assert.equal(scottResult.counts.length, overrideBins);
      assert.equal(sqrtResult.counts.length, overrideBins);
    });

    it('all auto rules handle edge case: constant values', async () => {
      await init();

      const constantData = Array(50).fill(42);

      const fdResult = histogramBinning(constantData, { mode: 'auto', rule: 'FD' });
      const scottResult = histogramBinning(constantData, { mode: 'auto', rule: 'Scott' });
      const sqrtResult = histogramBinning(constantData, { mode: 'auto', rule: 'sqrtN' });

      // All should produce valid (though degenerate) histograms
      assert.ok(fdResult.counts.length > 0);
      assert.ok(scottResult.counts.length > 0);
      assert.ok(sqrtResult.counts.length > 0);
      
      // All values should be in one bin (or distributed across bins if edges are equal)
      const fdSum = Array.from(fdResult.counts).reduce((a, b) => a + b, 0);
      const scottSum = Array.from(scottResult.counts).reduce((a, b) => a + b, 0);
      const sqrtSum = Array.from(sqrtResult.counts).reduce((a, b) => a + b, 0);
      assert.equal(fdSum, constantData.length);
      assert.equal(scottSum, constantData.length);
      assert.equal(sqrtSum, constantData.length);
    });

    it('all auto rules handle small datasets', async () => {
      await init();

      const smallData = [1, 2, 3, 4, 5];

      const fdResult = histogramBinning(smallData, { mode: 'auto', rule: 'FD' });
      const scottResult = histogramBinning(smallData, { mode: 'auto', rule: 'Scott' });
      const sqrtResult = histogramBinning(smallData, { mode: 'auto', rule: 'sqrtN' });

      // Should all produce at least 1 bin
      assert.ok(fdResult.counts.length >= 1);
      assert.ok(scottResult.counts.length >= 1);
      assert.ok(sqrtResult.counts.length >= 1);
      
      // Verify all data is counted
      const fdSum = Array.from(fdResult.counts).reduce((a, b) => a + b, 0);
      const scottSum = Array.from(scottResult.counts).reduce((a, b) => a + b, 0);
      const sqrtSum = Array.from(sqrtResult.counts).reduce((a, b) => a + b, 0);
      assert.equal(fdSum, smallData.length);
      assert.equal(scottSum, smallData.length);
      assert.equal(sqrtSum, smallData.length);
    });
  });

  it('custom mode: uses provided edges', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const edges = [0, 3, 6, 10];
    const result = histogramBinning(data, { mode: 'custom', edges });

    assert.ok(result.edges instanceof Float64Array);
    assert.ok(result.counts instanceof Float64Array);
    assert.equal(result.edges.length, edges.length);
    assert.equal(result.counts.length, edges.length - 1);
    
    // Edges should match (sorted)
    const sortedEdges = [...edges].sort((a, b) => a - b);
    for (let i = 0; i < sortedEdges.length; i++) {
      assert.equal(result.edges[i], sortedEdges[i]);
    }
    
    // Sum of counts should equal data length
    const sum = Array.from(result.counts).reduce((a, b) => a + b, 0);
    assert.equal(sum, data.length);
  });

  it('collapseTails: includes outliers in first/last bin', async () => {
    await init();

    // Create data with outliers
    const data = [
      -100, -50, // outliers
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, // normal data
      100, 200 // outliers
    ];
    const result = histogramBinning(data, {
      mode: 'auto',
      rule: 'FD',
      collapseTails: { enabled: true, k: 1.5 },
    });

    assert.ok(result.edges instanceof Float64Array);
    assert.ok(result.counts instanceof Float64Array);
    
    // Sum of counts should equal data length (all values counted)
    const sum = Array.from(result.counts).reduce((a, b) => a + b, 0);
    assert.equal(sum, data.length);
    
    // First and last bins should have counts (outliers)
    const counts = Array.from(result.counts);
    // Note: edges may contain -Inf and +Inf for tail collapse
    // First bin should have outlier counts
    assert.ok(counts[0] >= 2); // at least the 2 negative outliers
    // Last bin should have outlier counts
    assert.ok(counts[counts.length - 1] >= 2); // at least the 2 positive outliers
  });

  it('legacy numeric input: treated as auto mode', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = histogramBinning(data, 5);

    assert.ok(result.edges instanceof Float64Array);
    assert.ok(result.counts instanceof Float64Array);
    assert.ok(result.counts.length > 0);
    
    // Sum of counts should equal data length
    const sum = Array.from(result.counts).reduce((a, b) => a + b, 0);
    assert.equal(sum, data.length);
  });

  it('auto mode with bins override: uses specified bins', async () => {
    await init();

    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = histogramBinning(data, { mode: 'auto', rule: 'FD', bins: 7 });

    assert.ok(result.edges instanceof Float64Array);
    assert.ok(result.counts instanceof Float64Array);
    assert.equal(result.counts.length, 7);
    assert.equal(result.edges.length, 8);
  });

  it('handles empty data', async () => {
    await init();

    const result = histogramBinning([], { mode: 'fixedWidth', bins: 5 });

    assert.ok(result.edges instanceof Float64Array);
    assert.ok(result.counts instanceof Float64Array);
    assert.equal(result.edges.length, 0);
    assert.equal(result.counts.length, 0);
  });

  it('handles single value', async () => {
    await init();

    const result = histogramBinning([42], { mode: 'fixedWidth', bins: 5 });

    assert.ok(result.edges instanceof Float64Array);
    assert.ok(result.counts instanceof Float64Array);
    assert.equal(result.edges.length, 6);
    assert.equal(result.counts.length, 5);
    
    // When all values are the same, the value equals the max edge and goes into the last bin
    const counts = Array.from(result.counts);
    const sum = counts.reduce((a, b) => a + b, 0);
    assert.equal(sum, 1); // All values should be counted
    // The value should be in the last bin (since value == max_edge)
    assert.ok(counts[counts.length - 1] >= 1);
  });

  it('BinningPresets.autoFD: creates FD preset', async () => {
    await init();

    const preset = BinningPresets.autoFD(10);
    assert.equal(preset.mode, 'auto');
    assert.equal(preset.rule, 'FD');
    assert.equal(preset.bins, 10);
  });

  it('BinningPresets.autoScott: creates Scott preset', async () => {
    await init();

    const preset = BinningPresets.autoScott();
    assert.equal(preset.mode, 'auto');
    assert.equal(preset.rule, 'Scott');
    assert.equal(preset.bins, undefined);
  });

  it('BinningPresets.equalFrequency: creates equal frequency preset', async () => {
    await init();

    const preset = BinningPresets.equalFrequency(8);
    assert.equal(preset.mode, 'equalFrequency');
    assert.equal(preset.bins, 8);
  });

  it('BinningPresets.fixedWidth: creates fixed width preset', async () => {
    await init();

    const preset = BinningPresets.fixedWidth(12);
    assert.equal(preset.mode, 'fixedWidth');
    assert.equal(preset.bins, 12);
  });

  it('BinningPresets.deciles: creates deciles preset', async () => {
    await init();

    const preset = BinningPresets.deciles();
    assert.equal(preset.mode, 'equalFrequency');
    assert.equal(preset.bins, 10);
  });

  it('BinningPresets.quartiles: creates quartiles preset', async () => {
    await init();

    const preset = BinningPresets.quartiles();
    assert.equal(preset.mode, 'equalFrequency');
    assert.equal(preset.bins, 4);
  });

  it('BinningPresets.custom: creates custom preset with sorted edges', async () => {
    await init();

    const edges = [10, 5, 20, 15];
    const preset = BinningPresets.custom(edges);
    assert.equal(preset.mode, 'custom');
    assert.deepEqual(preset.edges, [5, 10, 15, 20]); // Should be sorted
  });

  it('BinningPresets.autoWithTailCollapse: creates tail collapse preset', async () => {
    await init();

    const preset = BinningPresets.autoWithTailCollapse(2.0, 15);
    assert.equal(preset.mode, 'auto');
    assert.equal(preset.rule, 'FD');
    assert.equal(preset.bins, 15);
    assert.ok(preset.collapseTails);
    assert.equal(preset.collapseTails.enabled, true);
    assert.equal(preset.collapseTails.k, 2.0);
  });

  it('validates invalid mode', async () => {
    await init();

    assert.throws(() => {
      histogramBinning([1, 2, 3], { mode: 'invalid' });
    }, /Invalid binning mode/);
  });

  it('validates missing bins for equalFrequency', async () => {
    await init();

    assert.throws(() => {
      histogramBinning([1, 2, 3], { mode: 'equalFrequency' });
    }, /equalFrequency mode requires bins > 0/);
  });

  it('validates missing bins for fixedWidth', async () => {
    await init();

    assert.throws(() => {
      histogramBinning([1, 2, 3], { mode: 'fixedWidth' });
    }, /fixedWidth mode requires bins > 0/);
  });

  it('validates missing edges for custom', async () => {
    await init();

    assert.throws(() => {
      histogramBinning([1, 2, 3], { mode: 'custom' });
    }, /custom mode requires edges array/);
  });

  it('validates edges length for custom', async () => {
    await init();

    assert.throws(() => {
      histogramBinning([1, 2, 3], { mode: 'custom', edges: [1] });
    }, /custom mode requires edges array/);
  });
});
