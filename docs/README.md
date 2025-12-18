# Documentation

This directory contains the documentation for `@addmaple/stats`.

## Structure

```
docs/
├── .vitepress/          # VitePress configuration
├── guide/              # User guides
├── examples/           # Code examples
├── api/                # Auto-generated API reference
├── scripts/            # Documentation generation scripts
└── package.json        # Documentation dependencies
```

## Development

### Install Dependencies

```bash
cd docs
npm install
```

### Run Development Server

```bash
npm run dev
```

This starts a local development server at `http://localhost:5173`

### Build Documentation

```bash
npm run build
```

This generates:
1. API reference from TypeScript using TypeDoc
2. Static site using VitePress

### Preview Built Site

```bash
npm run preview
```

## Generating API Reference

The API reference is auto-generated from TypeScript source:

```bash
npm run docs:api
```

This runs TypeDoc on `js/package/src/index.ts` and generates markdown files in `docs/api/`.

## Adding Examples

Examples are stored in `docs/examples/` as markdown files with code blocks. Each example should:

1. Import necessary functions
2. Call `await init()` first
3. Show practical usage
4. Include comments explaining the code

## Documentation Workflow

1. **Update TypeScript source** - Add/update functions in `js/package/src/index.ts`
2. **Add JSDoc comments** - Include `@param`, `@returns`, `@example` tags
3. **Regenerate API** - Run `npm run docs:api`
4. **Add examples** - Create example files in `docs/examples/`
5. **Build and preview** - Run `npm run build && npm run preview`

## Auto-Generation

The documentation uses several auto-generation tools:

- **TypeDoc** - Generates API reference from TypeScript
- **VitePress** - Generates static site from markdown
- **Scripts** - Extract examples from source code

## Contributing

When adding new features:

1. Add JSDoc comments with examples
2. Update relevant guide pages
3. Add example files
4. Regenerate API reference
5. Test locally with `npm run dev`








