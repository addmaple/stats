# Glassdoor Review Query Fixtures

Sample employee review data for testing statistical queries and catching regressions.

## Files

| File | Description |
|------|-------------|
| `glassdoor-reviews.json` | 1,100 reviews across Walmart, Comcast, FedEx, and Wells Fargo (canonical format for query runner) |
| `glassdoor-reviews.csv` | Same data in CSV format (for upload/import testing) |
| `queries.json` | 17 predefined queries with expected results |

## Schema

| Column | Type | Example |
|--------|------|---------|
| `review_id` | string | `WMT-42` |
| `company` | string | `Walmart` |
| `rating` | float (1–5) | `4.0` |
| `employee_type` | string | `Current Employee, more than 1 year` |
| `review` | string | Review headline/summary |
| `pros` | string | What the employee liked |
| `cons` | string | What the employee disliked |
| `date` | string | Review date |
| `job_title` | string | `Cashier` |

## Running Queries

From the repo root:

```bash
cd js/tests && npm install
npm run test:glassdoor
```

Or directly:

```bash
cd js/tests
node scripts/run-queries.mjs glassdoor
```

### Try ad-hoc queries

```bash
node scripts/run-queries.mjs glassdoor --try "mean rating where company=Comcast"
node scripts/run-queries.mjs glassdoor --try "count rating where rating_gte=4"
node scripts/run-queries.mjs glassdoor --list
```

### Rebuild sample data

```bash
python3 scripts/build-glassdoor-sample.py
```

## Data Source

Sample data is derived from the [Sentiment-Analysis-on-Glassdoor-Comments](https://github.com/mihir1493/Sentiment-Analysis-on-Glassdoor-Comments) public dataset. Only a subset is included to keep the repo lightweight.
