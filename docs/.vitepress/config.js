import { defineConfig } from 'vitepress'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  title: '@addmaple/stats',
  description: 'A faster version of jStat using Rust compiled to WebAssembly under the hood',
  base: '/',
  outDir: './dist',
  ignoreDeadLinks: false,
  
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'GitHub', link: 'https://github.com/yourusername/stats' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'Concepts',
          items: [
            { text: 'Initialization', link: '/guide/initialization' },
            { text: 'Performance', link: '/guide/performance' },
            { text: 'Tree-Shaking', link: '/guide/tree-shaking' },
            { text: 'Browser Support', link: '/guide/browser-support' }
          ]
        },
        {
          text: 'Reference',
          items: [
            { text: 'Features', link: '/guide/features' },
            { text: 'Architecture', link: '/guide/architecture' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Initialization', link: '/api/initialization' }
          ]
        },
        {
          text: 'Statistics',
          items: [
            { text: 'Basic Statistics', link: '/api/basic-statistics' },
            { 
              text: 'Key Functions',
              collapsed: true,
              items: [
                { text: 'sum', link: '/api/functions/sum/' },
                { text: 'mean', link: '/api/functions/mean/' },
                { text: 'variance', link: '/api/functions/variance/' },
                { text: 'stdev', link: '/api/functions/stdev/' },
                { text: 'min', link: '/api/functions/min/' },
                { text: 'max', link: '/api/functions/max/' }
              ]
            },
            { text: 'Advanced Statistics', link: '/api/advanced-statistics' },
            { 
              text: 'Key Functions',
              collapsed: true,
              items: [
                { text: 'median', link: '/api/functions/median/' },
                { text: 'mode', link: '/api/functions/mode/' },
                { text: 'skewness', link: '/api/functions/skewness/' },
                { text: 'kurtosis', link: '/api/functions/kurtosis/' }
              ]
            }
          ]
        },
        {
          text: 'Quantiles & Percentiles',
          items: [
            { text: 'Overview', link: '/api/quantiles-percentiles' },
            { 
              text: 'Key Functions',
              collapsed: true,
              items: [
                { text: 'percentile', link: '/api/functions/percentile/' },
                { text: 'quartiles', link: '/api/functions/quartiles/' },
                { text: 'iqr', link: '/api/functions/iqr/' }
              ]
            },
            { text: 'All Functions', link: '/api/functions/' }
          ]
        },
        {
          text: 'Correlation & Covariance',
          items: [
            { text: 'Overview', link: '/api/correlation-covariance' },
            { 
              text: 'Functions',
              collapsed: true,
              items: [
                { text: 'corrcoeff', link: '/api/functions/corrcoeff/' },
                { text: 'spearmancoeff', link: '/api/functions/spearmancoeff/' },
                { text: 'covariance', link: '/api/functions/covariance/' }
              ]
            }
          ]
        },
        {
          text: 'Distributions',
          items: [
            { text: 'Overview', link: '/api/distributions' },
            { 
              text: 'Common Distributions',
              collapsed: true,
              items: [
                { text: 'normal', link: '/api/functions/normal/' },
                { text: 'gamma', link: '/api/functions/gamma/' },
                { text: 'beta', link: '/api/functions/beta/' },
                { text: 'studentT', link: '/api/functions/studentT/' },
                { text: 'exponential', link: '/api/functions/exponential/' },
                { text: 'poisson', link: '/api/functions/poisson/' },
                { text: 'binomial', link: '/api/functions/binomial/' }
              ]
            },
            { text: 'All Distributions', link: '/api/functions/' }
          ]
        },
        {
          text: 'Statistical Tests',
          items: [
            { text: 'Overview', link: '/api/statistical-tests' },
            { 
              text: 'Key Functions',
              collapsed: true,
              items: [
                { text: 'anovaTest', link: '/api/functions/anovaTest/' },
                { text: 'ttest', link: '/api/functions/ttest/' },
                { text: 'chiSquareTest', link: '/api/functions/chiSquareTest/' },
                { text: 'regress', link: '/api/functions/regress/' }
              ]
            }
          ]
        },
        {
          text: 'Transformations',
          items: [
            { text: 'Overview', link: '/api/transformations' },
            { 
              text: 'Key Functions',
              collapsed: true,
              items: [
                { text: 'cumsum', link: '/api/functions/cumsum/' },
                { text: 'diff', link: '/api/functions/diff/' },
                { text: 'rank', link: '/api/functions/rank/' },
                { text: 'histogram', link: '/api/functions/histogram/' }
              ]
            }
          ]
        },
        {
          text: 'Complete Reference',
          items: [
            { text: 'All Functions', link: '/api/functions/' },
            { text: 'Complete API Reference', link: '/api/README' }
          ]
        },
        {
          text: 'Interfaces & Types',
          items: [
            { text: 'DistributionHandle', link: '/api/interfaces/DistributionHandle' },
            { text: 'AnovaResult', link: '/api/interfaces/AnovaResult' },
            { text: 'QuartilesResult', link: '/api/interfaces/QuartilesResult' },
            { 
              text: 'Distribution Parameters',
              collapsed: true,
              items: [
                { text: 'NormalParams', link: '/api/interfaces/NormalParams' },
                { text: 'GammaParams', link: '/api/interfaces/GammaParams' },
                { text: 'BetaParams', link: '/api/interfaces/BetaParams' },
                { text: 'StudentTParams', link: '/api/interfaces/StudentTParams' },
                { text: 'ChiSquaredParams', link: '/api/interfaces/ChiSquaredParams' },
                { text: 'FisherFParams', link: '/api/interfaces/FisherFParams' },
                { text: 'ExponentialParams', link: '/api/interfaces/ExponentialParams' }
              ]
            }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Basic Statistics', link: '/examples/basic-statistics' },
            { text: 'Correlation', link: '/examples/correlation' },
            { text: 'Distributions', link: '/examples/distributions' },
            { text: 'Quantiles', link: '/examples/quantiles' },
            { text: 'Statistical Tests', link: '/examples/statistical-tests' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/stats' }
    ],
    
    search: {
      provider: 'local'
    }
  },
  
  markdown: {
    code: {
      lineNumbers: true
    }
  },
  
  vite: {
    plugins: [wasm()],
    optimizeDeps: {
      exclude: ['@addmaple/stats'],
    },
    build: {
      target: 'es2022', // Support top-level await
    },
  },
})
