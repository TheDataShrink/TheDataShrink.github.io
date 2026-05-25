"""
Episode 10, sample 3 — weekly digest generator.

Renders a markdown digest covering: new eval fixtures, regressions,
top failure buckets, top feedback themes, cost trend, and the four
signals from Episode 9. Send to the team Slack on a cron.

Run:
    export DATABASE_URL=postgresql://...
    python 03-feedback-dash.py
"""

import os
from collections import Counter
from datetime import date, datetime, timedelta

import psycopg

DATABASE_URL = os.environ["DATABASE_URL"]


def _week_window(week_start: date) -> tuple[datetime, datetime]:
    start = datetime.combine(week_start, datetime.min.time())
    return start, start + timedelta(days=7)


def count_fixtures_added(since: datetime) -> int:
    """Count promoted fixtures (status='promoted' in the triage table)."""
    with psycopg.connect(DATABASE_URL) as cn, cn.cursor() as cur:
        cur.execute(
            "SELECT count(*) FROM feedback_triage "
            "WHERE status='promoted' AND decided_at >= %s",
            (since,),
        )
        return cur.fetchone()[0]


def find_regressions(since: datetime) -> list[str]:
    """Stub: read the eval harness's CI output for new failures.

    In production, this reads the eval-run table you write to from
    Episode 6's harness whenever it runs in CI.
    """
    return []  # implementation specific to your harness storage


def top_failure_buckets(since: datetime, n: int) -> list[tuple[str, int]]:
    """Read from Episode 7's failures.csv or its Postgres equivalent."""
    # Stub: assume a failures table exists.
    with psycopg.connect(DATABASE_URL) as cn, cn.cursor() as cur:
        cur.execute(
            "SELECT bucket, count(*) FROM failures "
            "WHERE created_at >= %s GROUP BY bucket ORDER BY count(*) DESC LIMIT %s",
            (since, n),
        )
        return cur.fetchall()


def top_feedback_themes(since: datetime, n: int) -> list[tuple[str, int]]:
    """Group recent negative feedback by reason string (or by simple bucket)."""
    with psycopg.connect(DATABASE_URL) as cn, cn.cursor() as cur:
        cur.execute(
            """
            SELECT COALESCE(value->>'reason', '(unspecified)') AS reason, count(*)
              FROM feedback_events
             WHERE created_at >= %s AND kind IN ('thumbs','flag')
             GROUP BY reason
             ORDER BY count(*) DESC
             LIMIT %s
            """,
            (since, n),
        )
        return cur.fetchall()


def four_signals(since: datetime) -> dict:
    """Read latency, traffic, errors, cost from your accounting table."""
    # Stub: assume a gateway_ledger table populated by Episode 9's gateway.
    with psycopg.connect(DATABASE_URL) as cn, cn.cursor() as cur:
        cur.execute(
            """
            SELECT count(*)                                       AS calls,
                   coalesce(sum(cost_usd), 0)                     AS cost,
                   coalesce(avg(latency_ms), 0)                   AS latency_avg,
                   coalesce(percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms), 0)
                                                                  AS latency_p95,
                   coalesce(sum(CASE WHEN error THEN 1 ELSE 0 END), 0) AS errors
              FROM gateway_ledger
             WHERE created_at >= %s
            """,
            (since,),
        )
        cols = [d[0] for d in cur.description]
        return dict(zip(cols, cur.fetchone()))


def render_digest(week_start: date) -> str:
    start, _ = _week_window(week_start)

    new_fix    = count_fixtures_added(start)
    regs       = find_regressions(start)
    buckets    = top_failure_buckets(start, 5)
    themes     = top_feedback_themes(start, 5)
    signals    = four_signals(start)

    lines = [
        f"# Weekly digest — week of {week_start.isoformat()}",
        "",
        f"**New eval fixtures promoted:** {new_fix}",
        f"**Regressions in CI:** {len(regs)}",
        "",
        "## Four signals",
        f"- calls: {signals['calls']:,}",
        f"- errors: {signals['errors']:,}",
        f"- p95 latency: {signals['latency_p95']:.0f} ms",
        f"- cost: ${signals['cost']:.2f}",
        "",
        "## Top failure buckets",
        *(f"- {b}: {n}" for b, n in buckets),
        "",
        "## Top feedback themes",
        *(f"- {t}: {n}" for t, n in themes),
        "",
        "_Generated automatically. Action items: triage the top bucket, "
        "promote at least 3 fixtures, ship at least one improvement this week._",
    ]
    return "\n".join(lines)


if __name__ == "__main__":
    monday = date.today() - timedelta(days=date.today().weekday())
    print(render_digest(monday))
