-- Episode 3, sample 1 — schema for a tiny hybrid retrieval store.
--
-- Requires the pgvector extension. On most managed Postgres providers
-- it's a one-line CREATE EXTENSION. On local installs you may need to
-- install it first (https://github.com/pgvector/pgvector).

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents (
    id          BIGSERIAL PRIMARY KEY,
    source      TEXT NOT NULL,
    title       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chunks (
    id          BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    ord         INT NOT NULL,
    content     TEXT NOT NULL,
    embedding   VECTOR(1024),
    tsv         TSVECTOR
);

-- Approximate nearest neighbor index for cosine distance.
-- `lists = 100` is fine for up to ~1M rows. Tune up for larger sets.
CREATE INDEX IF NOT EXISTS chunks_embedding_idx
    ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- GIN index for full-text search.
CREATE INDEX IF NOT EXISTS chunks_tsv_idx
    ON chunks USING GIN (tsv);

-- Helpful for re-ingestion: an upsert-friendly index.
CREATE INDEX IF NOT EXISTS chunks_document_ord_idx
    ON chunks (document_id, ord);
