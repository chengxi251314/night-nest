import sqlite3
import os

DB = os.path.join(os.path.dirname(__file__), "..", "apps", "api", "prisma", "dev.db")
conn = sqlite3.connect(DB)
rows = conn.execute("SELECT id, role, content, createdAt FROM Message ORDER BY createdAt").fetchall()
for r in rows:
    print(r)
conn.close()
