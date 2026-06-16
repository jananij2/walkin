"""Walkin — SQLite database access. Raw sqlite3 (no ORM)."""

import os
import sqlite3
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("WALKIN_DB_PATH", BACKEND_DIR / "walkin.db"))
SCHEMA_PATH = BACKEND_DIR / "schema.sql"

DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db(conn: sqlite3.Connection | None = None) -> None:
    own_conn = conn is None
    if own_conn:
        conn = get_db()
    try:
        conn.executescript(SCHEMA_PATH.read_text())
        conn.commit()
    finally:
        if own_conn:
            conn.close()


if __name__ == "__main__":
    init_db()
    print(f"Initialised schema at {DB_PATH}")
