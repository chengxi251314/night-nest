import sqlite3
conn = sqlite3.connect(r"F:/自媒体/night-nest/apps/api/prisma/dev.db")
cur = conn.cursor()
cur.execute("SELECT c.id, c.characterId, COUNT(m.id) FROM Conversation c LEFT JOIN Message m ON c.id = m.conversationId GROUP BY c.id")
for r in cur.fetchall():
    print(r)
print("---")
cur.execute("SELECT id, characterId, role, content FROM Message WHERE conversationId = (SELECT id FROM Conversation WHERE characterId = 'luoyin' LIMIT 1) ORDER BY createdAt DESC LIMIT 5")
for r in cur.fetchall():
    print(r[0][:10], r[1], r[2], r[3][:40] if r[3] else '')
conn.close()
