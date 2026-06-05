# Walmart Glassdoor Review Query Fixtures

Reference dataset for query testing — mirrors the Glassdoor multi-company fixture pattern but scoped to Walmart only.

## Files

| File | Description |
|------|-------------|
| `walmart-reviews.json` | 500 Walmart employee reviews (canonical format for query runner) |
| `walmart-reviews.csv` | Same data in CSV format |
| `queries.json` | 11 predefined queries with expected results |

## Running Queries

```bash
cd js/tests && npm install
npm run test:walmart
node scripts/run-queries.mjs walmart --list
node scripts/run-queries.mjs walmart --try "mean rating"
```

See [../glassdoor/README.md](../glassdoor/README.md) for the full schema and rebuild instructions.
