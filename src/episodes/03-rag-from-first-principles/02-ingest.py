"""
Episode 3, sample 2 — ingest documents into the chunks table.

Reads a directory of text/markdown files, chunks each by paragraph with
overlap, embeds each chunk, and inserts. Idempotent by source path:
re-ingesting a file replaces its rows.

Run:
    export DATABASE_URL=postgresql://...
    export VOYAGE_API_KEY=...
    python 02-ingest.py path/to/notes/
"""

import os
import sys
from pathlib import Path

import psycopg
import voyageai  # swap for openai/cohere/etc. if you prefer

VOYAGE = voyageai.Client(api_key=os.environ["VOYAGE_API_KEY"])
EMBEDDING_MODEL = "voyage-3-lite"  # 1024-dim, matches the schema
DATABASE_URL = os.environ["DATABASE_URL"]


def chunk_text(text: str, target_words: int = 200, overlap_words: int = 40) -> list[str]:
    """Paragraph-first chunker with word-count target and tail overlap."""
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    buf: list[str] = []

    for p in paragraphs:
        words = p.split()
        if len(buf) + len(words) > target_words and buf:
            chunks.append(" ".join(buf))
            buf = buf[-overlap_words:]  # carry tail as overlap
        buf.extend(words)

    if buf:
        chunks.append(" ".join(buf))
    return chunks


def embed_batch(texts: list[str]) -> list[list[float]]:
    """One embedding API call per batch. Provider clients usually allow up to 128."""
    result = VOYAGE.embed(texts, model=EMBEDDING_MODEL, input_type="document")
    return result.embeddings


def ingest_file(cur, path: Path) -> None:
    text = path.read_text()
    chunks = chunk_text(text)
    if not chunks:
        return

    # delete the old version of this document, if any
    cur.execute("DELETE FROM documents WHERE source = %s", (str(path),))
    cur.execute(
        "INSERT INTO documents (source, title) VALUES (%s, %s) RETURNING id",
        (str(path), path.stem),
    )
    doc_id = cur.fetchone()[0]

    # embed in batches so we don't make one request per chunk
    BATCH = 64
    for start in range(0, len(chunks), BATCH):
        batch = chunks[start : start + BATCH]
        vectors = embed_batch(batch)
        for i, (text_chunk, vec) in enumerate(zip(batch, vectors)):
            cur.execute(
                """
                INSERT INTO chunks (document_id, ord, content, embedding, tsv)
                VALUES (%s, %s, %s, %s, to_tsvector('english', %s))
                """,
                (doc_id, start + i, text_chunk, vec, text_chunk),
            )

    print(f"  {path.name}: {len(chunks)} chunks")


def main(dirpath: str) -> None:
    root = Path(dirpath)
    files = list(root.rglob("*.md")) + list(root.rglob("*.txt"))
    print(f"ingesting {len(files)} file(s) from {root}")

    with psycopg.connect(DATABASE_URL, autocommit=False) as conn:
        with conn.cursor() as cur:
            for f in files:
                ingest_file(cur, f)
        conn.commit()


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "./notes")
