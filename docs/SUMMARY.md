# Documentation Summary

## What We Built

A comprehensive, auto-generated documentation system for `@stats/core` with:

✅ **Modern Documentation Site** - Built with VitePress  
✅ **Auto-Generated API Reference** - From TypeScript using TypeDoc  
✅ **Multiple Examples** - Organized by category with real-world use cases  
✅ **Well-Laid-Out Structure** - Easy navigation and search  
✅ **Auto-Generation Scripts** - Extract examples and generate docs  

## Key Features

### 1. Auto-Generated API Reference

The API reference is automatically generated from TypeScript source code:

- **TypeDoc** scans `js/package/src/index.ts`
- Extracts JSDoc comments, parameters, return types, examples
- Generates markdown files in `docs/api/`
- Updates automatically when you change the source code

**To regenerate:**
```bash
cd docs
npm run docs:api
```

### 2. Multiple Examples

Examples are organized by category:

- **Basic Statistics** - sum, mean, variance, etc.
- **Distributions** - normal, gamma, beta, etc.
- **Correlation** - covariance, Pearson, Spearman
- **Quantiles** - percentiles, quartiles, IQR
- **Statistical Tests** - ANOVA

Each example includes:
- Complete, runnable code
- Real-world scenarios
- Multiple use cases per function

### 3. Well-Laid-Out Structure

```
docs/
├── guide/          # User guides (getting started, installation, etc.)
├── examples/       # Code examples organized by category
├── api/            # Auto-generated API reference
└── scripts/        # Documentation generation scripts
```

Navigation:
- **Sidebar** - Organized by section
- **Search** - Local search across all docs
- **Quick Links** - Easy access to common pages

## How It Works

### Documentation Generation Flow

```
TypeScript Source (js/package/src/index.ts)
    ↓
JSDoc Comments (@param, @returns, @example)
    ↓
TypeDoc (npm run docs:api)
    ↓
Markdown API Reference (docs/api/)
    ↓
VitePress (npm run build)
    ↓
Static Site (docs/.vitepress/dist/)
```

### Example Flow

1. **Add JSDoc to TypeScript:**
   ```typescript
   /**
    * Calculate the mean of an array.
    * @param data - Array of numbers
    * @returns The mean value
    * @example
    * ```js
    * const avg = mean([1, 2, 3]); // 2
    * ```
    */
   export function mean(data: ArrayLike<number>): number {
     // ...
   }
   ```

2. **Generate API Docs:**
   ```bash
   npm run docs:api
   ```

3. **View Results:**
   - API reference updated in `docs/api/`
   - Examples extracted automatically
   - Ready to build and deploy

## Usage

### Development

```bash
cd docs
npm install
npm run dev
```

Opens development server at `http://localhost:5173`

### Build

```bash
npm run build
```

Generates:
1. API reference from TypeScript
2. Static site in `.vitepress/dist/`

### Preview

```bash
npm run preview
```

Preview the built site locally

## What's Auto-Generated

### ✅ Fully Auto-Generated

- **API Reference** - Function signatures, parameters, return types
- **Type Definitions** - Interfaces, types from TypeScript
- **Function Categories** - Grouped by JSDoc tags

### ✅ Partially Auto-Generated

- **Examples** - Can be extracted from `@example` tags
- **Code Blocks** - Can be generated from example files

### ✅ Manual (But Structured)

- **Guides** - Written in markdown, easy to maintain
- **Example Pages** - Structured templates, easy to add to

## Adding New Documentation

### 1. Add a Function

1. Write function in `js/package/src/index.ts`
2. Add JSDoc with `@param`, `@returns`, `@example`
3. Run `npm run docs:api` to regenerate API

### 2. Add an Example

1. Create `docs/examples/my-example.md`
2. Add code blocks with examples
3. Update sidebar in `.vitepress/config.js`

### 3. Add a Guide

1. Create `docs/guide/my-guide.md`
2. Write markdown content
3. Update sidebar configuration

## Benefits

### For Users

- **Easy to Navigate** - Clear structure and search
- **Multiple Examples** - See functions in action
- **Always Up-to-Date** - API docs match source code
- **Runnable Code** - Copy-paste examples that work

### For Maintainers

- **Auto-Generated** - Less manual work
- **Type-Safe** - TypeScript ensures accuracy
- **Easy to Update** - Change source, regenerate docs
- **Consistent** - Same format across all docs

## Next Steps

1. **Install dependencies:**
   ```bash
   cd docs && npm install
   ```

2. **Generate API reference:**
   ```bash
   npm run docs:api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Enhance JSDoc comments** in `js/package/src/index.ts` with more examples

5. **Add more examples** in `docs/examples/`

6. **Deploy** to GitHub Pages, Netlify, or Vercel

## Tools Used

- **[VitePress](https://vitepress.dev/)** - Documentation site generator
- **[TypeDoc](https://typedoc.org/)** - API documentation generator
- **[typedoc-plugin-markdown](https://github.com/tgreyuk/typedoc-plugin-markdown)** - Markdown output for TypeDoc

## Tips

1. **Always include examples** in JSDoc comments
2. **Use real-world scenarios** in examples
3. **Keep examples runnable** - test them!
4. **Regenerate API docs** after changing TypeScript
5. **Preview locally** before committing

