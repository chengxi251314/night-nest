import sqlite3
db = r"F:\自媒体\night-nest\apps\api\prisma\dev.db"
conn = sqlite3.connect(db)
cur = conn.cursor()

cur.execute("""
    CREATE TABLE IF NOT EXISTS ForumTopic (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL DEFAULT '',
        content TEXT NOT NULL DEFAULT '',
        authorId TEXT NOT NULL DEFAULT '',
        tag TEXT NOT NULL DEFAULT 'general',
        replyCount INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL DEFAULT ''
    )
""")

cur.execute("""
    CREATE TABLE IF NOT EXISTS ForumReply (
        id TEXT PRIMARY KEY,
        topicId TEXT NOT NULL,
        authorId TEXT NOT NULL DEFAULT '',
        content TEXT NOT NULL DEFAULT '',
        createdAt TEXT NOT NULL DEFAULT '',
        FOREIGN KEY (topicId) REFERENCES ForumTopic(id)
    )
""")

print("Created Forum tables")

# Add index for ordering
try:
    cur.execute("CREATE INDEX IF NOT EXISTS idx_forum_topic_time ON ForumTopic(createdAt DESC)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_forum_reply_topic ON ForumReply(topicId, createdAt ASC)")
except:
    pass

conn.commit()
conn.close()
print("Done.")
