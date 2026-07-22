"""Create SQLite database and seed data for Night Nest.
Uses date strings compatible with Prisma's DateTime parsing.
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "apps", "api", "prisma", "dev.db")

NOW = "2026-07-21T08:00:00.000Z"

def create_tables(cursor):
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS User (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            createdAt TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Character (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            title TEXT NOT NULL,
            world TEXT NOT NULL,
            createdAt TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Conversation (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            characterId TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'active',
            createdAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES User(id),
            FOREIGN KEY (characterId) REFERENCES Character(id)
        );
        CREATE INDEX IF NOT EXISTS idx_conv_uc ON Conversation(userId, characterId);

        CREATE TABLE IF NOT EXISTS Message (
            id TEXT PRIMARY KEY,
            conversationId TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (conversationId) REFERENCES Conversation(id)
        );
        CREATE INDEX IF NOT EXISTS idx_msg_ct ON Message(conversationId, createdAt);

        CREATE TABLE IF NOT EXISTS RelationshipState (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            characterId TEXT NOT NULL,
            score INTEGER NOT NULL DEFAULT 0,
            stage TEXT NOT NULL,
            mood TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES User(id),
            FOREIGN KEY (characterId) REFERENCES Character(id),
            UNIQUE(userId, characterId)
        );

        CREATE TABLE IF NOT EXISTS MemoryEntry (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            characterId TEXT NOT NULL,
            summary TEXT NOT NULL,
            weight INTEGER NOT NULL DEFAULT 1,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES User(id),
            FOREIGN KEY (characterId) REFERENCES Character(id)
        );
        CREATE INDEX IF NOT EXISTS idx_mem_uct ON MemoryEntry(userId, characterId, createdAt);

        CREATE TABLE IF NOT EXISTS StoryNode (
            id TEXT PRIMARY KEY,
            characterId TEXT NOT NULL,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            chapterOrder INTEGER NOT NULL,
            FOREIGN KEY (characterId) REFERENCES Character(id)
        );
        CREATE INDEX IF NOT EXISTS idx_story_co ON StoryNode(characterId, chapterOrder);

        CREATE TABLE IF NOT EXISTS StoryTrigger (
            id TEXT PRIMARY KEY,
            characterId TEXT NOT NULL,
            storyNodeId TEXT NOT NULL,
            triggerType TEXT NOT NULL,
            conditionKey TEXT NOT NULL,
            conditionValue TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (characterId) REFERENCES Character(id),
            FOREIGN KEY (storyNodeId) REFERENCES StoryNode(id)
        );
        CREATE INDEX IF NOT EXISTS idx_trig_ct ON StoryTrigger(characterId, triggerType);

        CREATE TABLE IF NOT EXISTS AiWriteback (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            characterId TEXT NOT NULL,
            conversationId TEXT,
            relationshipDelta INTEGER NOT NULL DEFAULT 0,
            memorySummary TEXT,
            triggeredNodeId TEXT,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES User(id),
            FOREIGN KEY (characterId) REFERENCES Character(id)
        );
        CREATE INDEX IF NOT EXISTS idx_wb_uct ON AiWriteback(userId, characterId, createdAt);
    """)

def seed(cursor):
    cursor.execute("INSERT OR IGNORE INTO User (id, email, createdAt) VALUES (?,?,?)",
                   ("demo-user", "demo@nightnest.local", "2026-07-21T08:00:00.000Z"))

    chars = [
        ("luoyin", "洛因", "危险而克制的魅魔独行者", "魔域边境 / 雾潮王庭"),
        ("shenye", "深野", "温柔外壳下的掌控型保护者", "财团都市 / 夜航俱乐部"),
        ("qinhuai", "秦淮", "冷感天才与迟到的心动", "近未来研究城"),
    ]
    for c in chars:
        cursor.execute("INSERT OR IGNORE INTO Character (id, name, title, world, createdAt) VALUES (?,?,?,?,?)",
                       (*c, NOW))

    rels = [
        ("rel-luoyin", "demo-user", "luoyin", 18, "试探期", "克制"),
        ("rel-shenye", "demo-user", "shenye", 12, "熟悉期", "从容"),
        ("rel-qinhuai", "demo-user", "qinhuai", 10, "观察期", "冷静"),
    ]
    for r in rels:
        cursor.execute("INSERT OR IGNORE INTO RelationshipState (id, userId, characterId, score, stage, mood, updatedAt) VALUES (?,?,?,?,?,?,?)",
                       (*r, NOW))

    convs = [
        ("conv-luoyin-001", "demo-user", "luoyin"),
        ("conv-shenye-001", "demo-user", "shenye"),
        ("conv-qinhuai-001", "demo-user", "qinhuai"),
    ]
    for c in convs:
        cursor.execute("INSERT OR IGNORE INTO Conversation (id, userId, characterId, status, createdAt) VALUES (?,?,?,'active',?)",
                       (*c, "2026-07-21T08:10:00.000Z"))

    msgs = [
        ("msg-luoyin-sys-001", "conv-luoyin-001", "system", "角色已载入：洛因", "2026-07-21T08:10:10.000Z"),
        ("msg-luoyin-char-001", "conv-luoyin-001", "character", "又来了？既然没走，那就坐近一点。别让我抬头找你。", "2026-07-21T08:10:20.000Z"),
        ("msg-shenye-sys-001", "conv-shenye-001", "system", "角色已载入：深野", "2026-07-21T08:15:10.000Z"),
        ("msg-shenye-char-001", "conv-shenye-001", "character", "你来的时间刚刚好。先把呼吸放慢一点，再告诉我今天是谁让你不开心。", "2026-07-21T08:15:20.000Z"),
        ("msg-qinhuai-sys-001", "conv-qinhuai-001", "system", "角色已载入：秦淮", "2026-07-21T08:20:10.000Z"),
        ("msg-qinhuai-char-001", "conv-qinhuai-001", "character", "如果你想留下，我可以为你空出今晚的实验记录时间。", "2026-07-21T08:20:20.000Z"),
    ]
    for m in msgs:
        cursor.execute("INSERT OR IGNORE INTO Message (id, conversationId, role, content, createdAt) VALUES (?,?,?,?,?)", m)

    mems = [
        ("mem-luoyin-001", "demo-user", "luoyin", "你第一次没有被他的危险感逼退。", 2, "2026-07-21T08:30:00.000Z"),
        ("mem-luoyin-002", "demo-user", "luoyin", "他开始记住你疲惫时的语气变化。", 1, "2026-07-21T08:32:00.000Z"),
        ("mem-shenye-001", "demo-user", "shenye", "他记住了你习惯先说没事再说真话。", 1, "2026-07-21T08:35:00.000Z"),
        ("mem-qinhuai-001", "demo-user", "qinhuai", "他第一次为你暂停了模型运算。", 1, "2026-07-21T08:40:00.000Z"),
    ]
    for m in mems:
        cursor.execute("INSERT OR IGNORE INTO MemoryEntry (id, userId, characterId, summary, weight, createdAt) VALUES (?,?,?,?,?,?)", m)

    stories = [
        ("story-luoyin-001", "luoyin", "第 01 章 · 夜色试探", "第一步不是进攻，而是让他确认你不会把靠近当成游戏。", 1),
        ("story-shenye-001", "shenye", "第 01 章 · 柔软接管", "先享受照顾，还是先试探边界？这是这条关系线的第一步。", 1),
        ("story-qinhuai-001", "qinhuai", "第 01 章 · 变量接近", "你要做的，是让他继续失衡。", 1),
    ]
    for s in stories:
        cursor.execute("INSERT OR IGNORE INTO StoryNode (id, characterId, title, body, chapterOrder) VALUES (?,?,?,?,?)", s)

    triggers = [
        ("trigger-luoyin-001", "luoyin", "story-luoyin-001", "relationship", "score_gte", "18"),
        ("trigger-shenye-001", "shenye", "story-shenye-001", "relationship", "score_gte", "12"),
        ("trigger-qinhuai-001", "qinhuai", "story-qinhuai-001", "relationship", "score_gte", "10"),
    ]
    for t in triggers:
        cursor.execute("INSERT OR IGNORE INTO StoryTrigger (id, characterId, storyNodeId, triggerType, conditionKey, conditionValue, createdAt) VALUES (?,?,?,?,?,?,?)",
                       (*t, NOW))

    cursor.execute("INSERT OR IGNORE INTO AiWriteback (id, userId, characterId, conversationId, relationshipDelta, memorySummary, triggeredNodeId, createdAt) VALUES (?,?,?,?,?,?,?,?)",
                   ("writeback-001", "demo-user", "luoyin", "conv-luoyin-001", 2, "你第一次主动安抚了他的戒备。", "story-luoyin-001", "2026-07-21T08:45:00.000Z"))

def main():
    # Delete old DB
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON")
    create_tables(cursor)
    seed(cursor)
    conn.commit()

    # Verify
    tables = ["User", "Character", "Conversation", "Message", "RelationshipState", "MemoryEntry", "StoryNode", "StoryTrigger", "AiWriteback"]
    for t in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {t}")
        count = cursor.fetchone()[0]
        print(f"  {t}: {count} rows")
    conn.close()
    print(f"\nDatabase ready at {DB_PATH}")

if __name__ == "__main__":
    main()
