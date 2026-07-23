import sqlite3
db = r"F:\自媒体\night-nest\apps\api\prisma\dev.db"
conn = sqlite3.connect(db)
cur = conn.cursor()
cur.execute("PRAGMA table_info(Script)")
for row in cur.fetchall():
    print(row)
cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%Script%'")
print("Tables:", [r[0] for r in cur.fetchall()])
conn.close()
