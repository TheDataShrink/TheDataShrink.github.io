-- Episode 4, sample 3 — schema additions for conversation memory and facts.
-- Apply after Episode 3's 01-schema.sql.

CREATE TABLE IF NOT EXISTS conversations (
    id         BIGSERIAL PRIMARY KEY,
    user_id    TEXT NOT NULL,
    summary    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
    id              BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    ord             INT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('user','assistant','tool')),
    content         TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_conversation_ord_idx
    ON messages (conversation_id, ord);

CREATE TABLE IF NOT EXISTS facts (
    id          BIGSERIAL PRIMARY KEY,
    user_id     TEXT NOT NULL,
    kind        TEXT NOT NULL CHECK (kind IN ('preference','constraint','history','identity')),
    content     TEXT NOT NULL,
    source_msg  BIGINT REFERENCES messages(id) ON DELETE SET NULL,
    embedding   VECTOR(1024),
    confidence  REAL NOT NULL DEFAULT 0.8,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS facts_user_idx ON facts (user_id);
CREATE INDEX IF NOT EXISTS facts_kind_idx ON facts (user_id, kind);
CREATE INDEX IF NOT EXISTS facts_embedding_idx
    ON facts USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- A view of currently-active facts, useful for retrieval queries.
CREATE OR REPLACE VIEW active_facts AS
    SELECT *
      FROM facts
     WHERE expires_at IS NULL OR expires_at > now();
