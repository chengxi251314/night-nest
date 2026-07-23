import sqlite3
import os

db_path = r"F:\自媒体\night-nest\apps\api\prisma\dev.db"
conn = sqlite3.connect(db_path)
cur = conn.cursor()

migrations = [
    ("imageUrl", "TEXT DEFAULT ''"),
    ("profile", "TEXT DEFAULT '{}'"),
    ("creatorId", "TEXT DEFAULT 'system'"),
]

for col, dtype in migrations:
    try:
        cur.execute(f"ALTER TABLE Character ADD COLUMN {col} {dtype}")
        print(f"Added column: {col}")
    except sqlite3.OperationalError as e:
        print(f"Skip {col}: {e}")

conn.commit()
conn.close()
print("Done.")
