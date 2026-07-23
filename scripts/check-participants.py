import sqlite3
db = r"F:\自媒体\night-nest\apps\api\prisma\dev.db"
conn = sqlite3.connect(db)
cur = conn.cursor()

print("=== Users ===")
cur.execute("SELECT * FROM User")
for r in cur.fetchall():
    print(r)

print("\n=== Participants ===")
cur.execute("SELECT * FROM ScriptParticipant")
for r in cur.fetchall():
    print(r)

print("\n=== Test JOIN with non-existent user ===")
cur.execute("SELECT sp.userId FROM ScriptParticipant sp LEFT JOIN User u ON sp.userId = u.id WHERE sp.scriptId = 'script-001'")
for r in cur.fetchall():
    print(r)

print("\n=== Test without JOIN ===")
cur.execute("SELECT userId, joinedAt FROM ScriptParticipant WHERE scriptId = 'script-001'")
for r in cur.fetchall():
    print(r)

conn.close()
