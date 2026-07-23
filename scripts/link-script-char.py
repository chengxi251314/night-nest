import sqlite3
db = r"F:\自媒体\night-nest\apps\api\prisma\dev.db"
conn = sqlite3.connect(db)
cur = conn.cursor()

# Add characterId to ScriptCharacter to link to real Character entries
try:
    cur.execute("ALTER TABLE ScriptCharacter ADD COLUMN characterId TEXT DEFAULT ''")
    print("Added characterId column")
except sqlite3.OperationalError as e:
    print(f"Skip: {e}")

conn.commit()
conn.close()
print("Done.")
