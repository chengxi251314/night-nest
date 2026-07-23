import sqlite3
db = r"F:\自媒体\night-nest\apps\api\prisma\dev.db"
conn = sqlite3.connect(db)
cur = conn.cursor()

# Create ScriptCharacter table for multi-character support
try:
    cur.execute("""
        CREATE TABLE IF NOT EXISTS ScriptCharacter (
            id TEXT PRIMARY KEY,
            scriptId TEXT NOT NULL,
            name TEXT NOT NULL DEFAULT '',
            prompt TEXT NOT NULL DEFAULT '',
            imageUrl TEXT NOT NULL DEFAULT '',
            sortOrder INTEGER NOT NULL DEFAULT 0,
            createdAt TEXT NOT NULL DEFAULT '',
            FOREIGN KEY (scriptId) REFERENCES Script(id)
        )
    """)
    print("Created ScriptCharacter table")
except sqlite3.OperationalError as e:
    print(f"Skip: {e}")

conn.commit()
conn.close()
print("Done.")
