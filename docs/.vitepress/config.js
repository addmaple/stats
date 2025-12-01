import { defineConfig } from 'vitepress'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  title: '@stats/core',
  description: 'High-performance statistics library built with Rust and WebAssembly',
  base: '/',
  ignoreDeadLinks: true,
  
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
            { text: 'Initialization', link: '/api/initialization' },
            { text: 'Basic Statistics', link: '/api/basic-statistics' },
            { text: 'Advanced Statistics', link: '/api/advanced-statistics' },
            { text: 'Quantiles & Percentiles', link: '/api/quantiles-percentiles' },
            { text: 'Correlation & Covariance', link: '/api/correlation-covariance' },
            { text: 'Distributions', link: '/api/distributions' },
            { text: 'Statistical Tests', link: '/api/statistical-tests' },
            { text: 'Transformations', link: '/api/transformations' },
            { text: 'Complete Reference', link: '/api/README' },
            { text: 'Individual Functions', link: '/api/functions/' },
            { text: 'Interfaces', items: [
              { text: 'DistributionHandle', link: '/api/interfaces/DistributionHandle' },
              { text: 'AnovaResult', link: '/api/interfaces/AnovaResult' },
              { text: 'QuartilesResult', link: '/api/interfaces/QuartilesResult' },
              { text: 'NormalParams', link: '/api/interfaces/NormalParams' },
              { text: 'GammaParams', link: '/api/interfaces/GammaParams' },
              { text: 'BetaParams', link: '/api/interfaces/BetaParams' },
              { text: 'StudentTParams', link: '/api/interfaces/StudentTParams' },
              { text: 'ChiSquaredParams', link: '/api/interfaces/ChiSquaredParams' },
              { text: 'FisherFParams', link: '/api/interfaces/FisherFParams' },
              { text: 'ExponentialParams', link: '/api/interfaces/ExponentialParams' }
            ]}
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Basic Statistics', link: '/examples/basic-statistics' },
            { text: 'Distributions', link: '/examples/distributions' },
            { text: 'Correlation', link: '/examples/correlation' },
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
  },
})

