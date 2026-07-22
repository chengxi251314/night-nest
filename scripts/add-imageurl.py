"""Add imageUrl to Script table."""
import sqlite3, os

DB = os.path.join(os.path.dirname(__file__), "..", "apps", "api", "prisma", "dev.db")
conn = sqlite3.connect(DB)
try:
    conn.execute("ALTER TABLE Script ADD COLUMN imageUrl TEXT NOT NULL DEFAULT ''")
    print("Added imageUrl column")
except:
    print("Column already exists")
conn.commit()
conn.close()
