-- Episode 10, sample 1 — feedback events schema.
--
-- One table, many event kinds. JSONB value lets the shape vary by
-- kind without forcing the schema to evolve every time you add a new
-- feedback affordance.

CREATE TABLE IF NOT EXISTS feedback_events (
    id              BIGSERIAL PRIMARY KEY,
    trace_id        TEXT NOT NULL,
    message_id      TEXT,
    user_id         TEXT NOT NULL,
    kind            TEXT NOT NULL CHECK (kind IN (
                        'rating', 'thumbs', 'regenerate',
                        'edit', 'flag', 'abandon', 'accept', 'copy'
                    )),
    value           JSONB,
    surface         TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS feedback_trace_idx ON feedback_events (trace_id);
CREATE INDEX IF NOT EXISTS feedback_user_idx  ON feedback_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS feedback_kind_idx  ON feedback_events (kind, created_at DESC);

-- Triage queue for events that look like real bugs.
CREATE TABLE IF NOT EXISTS feedback_triage (
    id                  BIGSERIAL PRIMARY KEY,
    feedback_event_id   BIGINT NOT NULL REFERENCES feedback_events(id) ON DELETE CASCADE,
    status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','dropped','promoted','converted')),
    decided_by          TEXT,
    decided_at          TIMESTAMPTZ,
    notes               TEXT,
    fixture_id          TEXT,         -- set if promoted to the eval set
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A view of currently-open triage items, ordered by age.
CREATE OR REPLACE VIEW open_triage AS
    SELECT t.*, e.user_id, e.kind, e.value, e.trace_id
      FROM feedback_triage t
      JOIN feedback_events e ON e.id = t.feedback_event_id
     WHERE t.status = 'pending'
     ORDER BY t.created_at ASC;
