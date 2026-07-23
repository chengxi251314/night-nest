import sqlite3
db = r"F:\自媒体\night-nest\apps\api\prisma\dev.db"
conn = sqlite3.connect(db)
cur = conn.cursor()

# Notifications table
cur.execute("""
    CREATE TABLE IF NOT EXISTS Notification (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL DEFAULT '',
        type TEXT NOT NULL DEFAULT '',
        title TEXT NOT NULL DEFAULT '',
        body TEXT NOT NULL DEFAULT '',
        link TEXT NOT NULL DEFAULT '',
        read INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL DEFAULT ''
    )
""")

# Forum likes
cur.execute("ALTER TABLE ForumTopic ADD COLUMN likes INTEGER NOT NULL DEFAULT 0")
cur.execute("ALTER TABLE ForumReply ADD COLUMN likes INTEGER NOT NULL DEFAULT 0")

# Script favorites
cur.execute("""
    CREATE TABLE IF NOT EXISTS ScriptFavorite (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL DEFAULT '',
        scriptId TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT ''
    )
""")

# Chat backgrounds per character
cur.execute("ALTER TABLE Character ADD COLUMN chatBackground TEXT DEFAULT ''")

print("All migrations done")
conn.commit()
conn.close()
