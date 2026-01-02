# Contributing to Stats

Thank you for your interest in contributing to the Stats library! This document provides guidelines and information for contributors.

## 🚀 Quick Start

### Prerequisites

- **Rust**: Latest stable version (1.70+)
- **Node.js**: Version 20 or later
- **npm**: Latest version
- **Git**: Latest version

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/addmaple/stats.git
   cd stats
   ```

2. **Install Rust dependencies**
   ```bash
   cargo check
   ```

3. **Install Node.js dependencies**
   ```bash
   # Main package
   cd js/package
   npm install

   # Documentation (optional)
   cd ../docs
   npm install
   ```

4. **Build the project**
   ```bash
   # Build everything
   cd js/package
   npm run build

   # Run tests
   npm test
   ```

## 🏗️ Development Workflow

### 1. Choose an Issue
- Check the [Issues](https://github.com/addmaple/stats/issues) page
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Changes
- Follow the coding standards below
- Write tests for new functionality
- Update documentation as needed
- Run tests frequently: `npm test`

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add new statistical function

- Add implementation in Rust core
- Add WASM bindings
- Add JavaScript API
- Add comprehensive tests
- Update documentation"
```

### 5. Create Pull Request
- Push your branch: `git push origin your-branch-name`
- Open a PR on GitHub
- Fill out the PR template
- Request review from maintainers

## 📝 Coding Standards

### Rust Code

#### Style
- Use `rustfmt` for formatting: `cargo fmt`
- Follow Clippy suggestions: `cargo clippy`
- Use descriptive variable names
- Add documentation comments for public APIs

#### Performance
- Prefer SIMD operations when possible
- Minimize allocations
- Use `#[inline]` judiciously for hot paths
- Profile performance-critical code

#### Safety
- Avoid `unsafe` code when possible
- Document any `unsafe` blocks with safety invariants
- Use Rust's type system for correctness

### JavaScript/TypeScript Code

#### Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use descriptive function/variable names
- Keep functions small and focused

#### Testing
- Write tests for all new functionality
- Test edge cases and error conditions
- Use descriptive test names
- Aim for high test coverage

### Documentation
- Update API documentation for new features
- Add examples for complex functionality
- Keep README and guides current
- Use clear, concise language

## 🧪 Testing

### Running Tests

```bash
# JavaScript tests
cd js/package
npm test

# Rust tests
cargo test

# Documentation tests (optional)
cd docs
npm run test
```

### Writing Tests

#### JavaScript Tests
```javascript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mean } from '@addmaple/stats';

describe('mean', () => {
  it('calculates arithmetic mean', () => {
    const result = mean([1, 2, 3, 4, 5]);
    assert.strictEqual(result, 3.0);
  });

  it('handles empty array', () => {
    const result = mean([]);
    assert(Number.isNaN(result));
  });
});
```

#### Rust Tests
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mean_basic() {
        let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        assert_eq!(mean(&data), 3.0);
    }

    #[test]
    fn test_mean_empty() {
        let data: Vec<f64> = vec![];
        assert!(mean(&data).is_nan());
    }
}
```

## 🔧 Development Scripts

```bash
# Build everything
npm run build

# Run tests
npm test

# Run benchmarks
cargo bench

# Check bundle size
npm run size:check

# Lint code
cargo clippy
npm run lint

# Format code
cargo fmt
npm run format
```

## 📊 Performance Guidelines

### When Adding New Functions
1. **Profile first**: Use benchmarks to establish baseline
2. **Optimize algorithms**: Choose O(n) over O(n²) when possible
3. **Use SIMD**: Leverage vectorization for data-parallel operations
4. **Memory efficiency**: Minimize allocations and copies
5. **Test performance**: Ensure no regressions

### Benchmarking
```bash
# Run Rust benchmarks
cargo bench

# Run JavaScript benchmarks
cd js/bench
npm install
npm run bench
```

## 📖 Documentation

### API Documentation
- Auto-generated from TypeScript sources
- Update JSDoc comments for new functions
- Include parameter descriptions and examples

### User Documentation
- Add examples to `docs/examples/`
- Update guides in `docs/guide/`
- Test documentation builds: `npm run docs:build`

## 🔒 Security

### Reporting Security Issues
- **DO NOT** create public GitHub issues for security vulnerabilities
- Email security concerns to: [security email or maintainers]
- Allow time for fixes before public disclosure

### Security Best Practices
- Keep dependencies updated
- Review code for potential vulnerabilities
- Use safe Rust patterns
- Validate inputs thoroughly

## 🤝 Code Review Process

### For Contributors
1. Ensure CI passes (all checks green)
2. Request review from maintainers
3. Address review feedback promptly
4. Keep commits focused and atomic

### For Reviewers
1. Check code correctness and safety
2. Verify test coverage
3. Ensure documentation is updated
4. Consider performance implications
5. Check adherence to coding standards

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Additional statistical functions
- Better error handling
- Cross-platform compatibility

### Medium Priority
- More comprehensive documentation
- Additional test coverage
- Performance benchmarks
- Example applications

### Low Priority
- Alternative language bindings
- GUI tools
- Educational materials
- Integration with other libraries

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/addmaple/stats/issues)
- **Discussions**: [GitHub Discussions](https://github.com/addmaple/stats/discussions)
- **Documentation**: [Stats Docs](https://addmaple.github.io/stats/)

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT).

Thank you for contributing to Stats! 🚀