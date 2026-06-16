"""Walkin — bootstrap: initialise the database schema on startup."""

from models import DB_PATH, init_db

if __name__ == "__main__":
    init_db()
    print(f"Database ready at {DB_PATH}")
