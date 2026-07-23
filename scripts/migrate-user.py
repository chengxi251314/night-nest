import sqlite3
db = r"F:\自媒体\night-nest\apps\api\prisma\dev.db"
conn = sqlite3.connect(db)
cur = conn.cursor()

migrations = [
    ("nickname", "TEXT DEFAULT ''"),
    ("avatar", "TEXT DEFAULT ''"),
    ("gender", "TEXT DEFAULT ''"),
    ("bio", "TEXT DEFAULT ''"),
]

for col, dtype in migrations:
    try:
        cur.execute(f"ALTER TABLE User ADD COLUMN {col} {dtype}")
        print(f"Added: {col}")
    except sqlite3.OperationalError as e:
        print(f"Skip {col}: {e}")

conn.commit()
conn.close()
print("Done.")
