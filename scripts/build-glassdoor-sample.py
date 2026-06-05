#!/usr/bin/env python3
"""
Build sample Glassdoor review datasets from public reference data.

Downloads review data from the mihir1493/Sentiment-Analysis-on-Glassdoor-Comments
repository and produces:
  - data/walmart/walmart-reviews.csv   (500 Walmart reviews)
  - data/glassdoor/glassdoor-reviews.csv (1100 reviews across 4 companies)
  - data/walmart/queries.json
  - data/glassdoor/queries.json

Usage:
  python3 scripts/build-glassdoor-sample.py
"""

import csv
import io
import json
import re
import statistics
import urllib.request
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://raw.githubusercontent.com/mihir1493/Sentiment-Analysis-on-Glassdoor-Comments/main"

FIELDNAMES = [
    "review_id", "company", "rating", "employee_type",
    "review", "pros", "cons", "date", "job_title",
]


def fetch_csv(url: str) -> str:
    with urllib.request.urlopen(url) as r:
        return r.read().decode("utf-8")


def fetch_json(url: str):
    with urllib.request.urlopen(url) as r:
        return json.load(r)


def parse_walmart(max_rows: int = 500) -> list[dict]:
    raw = fetch_csv(f"{BASE}/walmart/walmart_final.csv")
    reader = csv.DictReader(io.StringIO(raw))
    rows = []
    for i, row in enumerate(reader):
        if i >= max_rows:
            break
        rows.append({
            "review_id": f"WMT-{i}",
            "company": "Walmart",
            "rating": float(row["rating"]),
            "employee_type": row["employee_type"].strip(),
            "review": row["review"].strip(),
            "pros": row["pros"].strip(),
            "cons": row["cons"].strip(),
            "date": row["date"].strip(),
            "job_title": row["job title"].strip(),
        })
    return rows


def parse_json_company(company: str, prefix: str, url: str, max_rows: int = 200) -> list[dict]:
    data = fetch_json(url)
    rows = []
    count = 0
    for page in data:
        for j in range(len(page.get("rating", []))):
            if count >= max_rows:
                return rows
            date_pos = page["date_position"][j] if j < len(page.get("date_position", [])) else ""
            m = re.match(r"([A-Za-z]+ \d+, \d+) - (.+)", date_pos)
            rows.append({
                "review_id": f"{prefix}-{count}",
                "company": company,
                "rating": float(page["rating"][j]),
                "employee_type": page["employee_type"][j],
                "review": page["review"][j],
                "pros": page["pros"][j],
                "cons": page["cons"][j],
                "date": m.group(1) if m else date_pos,
                "job_title": m.group(2) if m else "",
            })
            count += 1
    return rows


def write_csv(path: Path, rows: list[dict]):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDNAMES, quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        w.writerows(rows)


def write_json(path: Path, rows: list[dict]):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2)


def column_stats(values: list[float]) -> dict:
    return {
        "count": len(values),
        "mean": round(statistics.mean(values), 6),
        "median": round(statistics.median(values), 6),
        "stdev": round(statistics.stdev(values), 6) if len(values) > 1 else 0,
    }


def build_queries(rows: list[dict], dataset_name: str) -> dict:
    queries = []
    all_ratings = [float(r["rating"]) for r in rows]
    s = column_stats(all_ratings)

    queries.extend([
        {"id": "overall-mean-rating", "description": "What is the average overall rating?",
         "operation": "mean", "column": "rating", "expected": s["mean"], "tolerance": 1e-6},
        {"id": "overall-median-rating", "description": "What is the median overall rating?",
         "operation": "median", "column": "rating", "expected": s["median"], "tolerance": 1e-6},
        {"id": "overall-stdev-rating", "description": "What is the standard deviation of ratings?",
         "operation": "stdev", "column": "rating", "expected": s["stdev"], "tolerance": 0.002},
        {"id": "rating-count", "description": "How many reviews are in the dataset?",
         "operation": "count", "column": "rating", "expected": s["count"], "tolerance": 0},
    ])

    by_company: dict[str, list[float]] = defaultdict(list)
    for r in rows:
        by_company[r["company"]].append(float(r["rating"]))

    for company, ratings in sorted(by_company.items()):
        cs = column_stats(ratings)
        slug = company.lower().replace(" ", "-")
        queries.extend([
            {"id": f"mean-rating-{slug}", "description": f"What is the average rating for {company}?",
             "operation": "mean", "column": "rating", "filter": {"company": company},
             "expected": cs["mean"], "tolerance": 1e-6},
            {"id": f"count-{slug}", "description": f"How many {company} reviews are there?",
             "operation": "count", "column": "rating", "filter": {"company": company},
             "expected": cs["count"], "tolerance": 0},
        ])

    current = [float(r["rating"]) for r in rows if r["employee_type"].startswith("Current")]
    former = [float(r["rating"]) for r in rows if r["employee_type"].startswith("Former")]
    if current:
        queries.append({
            "id": "mean-rating-current-employees", "description": "Average rating from current employees",
            "operation": "mean", "column": "rating", "filter": {"employee_type_prefix": "Current"},
            "expected": round(statistics.mean(current), 6), "tolerance": 1e-6,
        })
    if former:
        queries.append({
            "id": "mean-rating-former-employees", "description": "Average rating from former employees",
            "operation": "mean", "column": "rating", "filter": {"employee_type_prefix": "Former"},
            "expected": round(statistics.mean(former), 6), "tolerance": 1e-6,
        })

    queries.extend([
        {"id": "count-high-ratings", "description": "How many reviews have rating >= 4?",
         "operation": "count", "column": "rating", "filter": {"rating_gte": 4},
         "expected": sum(1 for r in rows if float(r["rating"]) >= 4), "tolerance": 0},
        {"id": "count-low-ratings", "description": "How many reviews have rating <= 2?",
         "operation": "count", "column": "rating", "filter": {"rating_lte": 2},
         "expected": sum(1 for r in rows if float(r["rating"]) <= 2), "tolerance": 0},
    ])

    sorted_ratings = sorted(all_ratings)
    p75 = sorted_ratings[int(0.75 * (len(sorted_ratings) - 1))]
    queries.append({
        "id": "rating-75th-percentile", "description": "What is the 75th percentile rating?",
        "operation": "percentile", "column": "rating", "params": {"p": 0.75},
        "expected": round(p75, 6), "tolerance": 1e-6,
    })

    return {"dataset": dataset_name, "queries": queries}


def main():
    print("Fetching Walmart reviews...")
    walmart_rows = parse_walmart()

    print("Fetching multi-company Glassdoor reviews...")
    extra = []
    for company, prefix, file in [
        ("Comcast", "CMCS", "comcast_final.json"),
        ("FedEx", "FDX", "fedex_new.json"),
        ("Wells Fargo", "WF", "wells_final.json"),
    ]:
        rows = parse_json_company(
            company, prefix,
            f"{BASE}/glassdoor/scraped%20datasets/{file}",
        )
        print(f"  {company}: {len(rows)} rows")
        extra.extend(rows)

    glassdoor_rows = walmart_rows + extra

    write_csv(ROOT / "data/walmart/walmart-reviews.csv", walmart_rows)
    write_json(ROOT / "data/walmart/walmart-reviews.json", walmart_rows)
    write_csv(ROOT / "data/glassdoor/glassdoor-reviews.csv", glassdoor_rows)
    write_json(ROOT / "data/glassdoor/glassdoor-reviews.json", glassdoor_rows)

    for name, rows, csv_name in [
        ("walmart", walmart_rows, "walmart-reviews.csv"),
        ("glassdoor", glassdoor_rows, "glassdoor-reviews.csv"),
    ]:
        qpath = ROOT / f"data/{name}/queries.json"
        with open(qpath, "w") as f:
            json.dump(build_queries(rows, csv_name), f, indent=2)
        print(f"Wrote {qpath} ({len(json.load(open(qpath))['queries'])} queries)")

    print(f"\nDone. Walmart: {len(walmart_rows)} rows, Glassdoor: {len(glassdoor_rows)} rows")


if __name__ == "__main__":
    main()
