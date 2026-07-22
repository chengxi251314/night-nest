"""Add script tables to the Night Nest database."""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "apps", "api", "prisma", "dev.db")

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS Script (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            characterName TEXT NOT NULL,
            characterPrompt TEXT NOT NULL,
            world TEXT NOT NULL DEFAULT '',
            tags TEXT NOT NULL DEFAULT '',
            creatorId TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'published',
            participantCount INTEGER NOT NULL DEFAULT 1,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (creatorId) REFERENCES User(id)
        );

        CREATE TABLE IF NOT EXISTS ScriptParticipant (
            id TEXT PRIMARY KEY,
            scriptId TEXT NOT NULL,
            userId TEXT NOT NULL,
            joinedAt TEXT NOT NULL,
            FOREIGN KEY (scriptId) REFERENCES Script(id),
            FOREIGN KEY (userId) REFERENCES User(id),
            UNIQUE(scriptId, userId)
        );

        CREATE TABLE IF NOT EXISTS ScriptMessage (
            id TEXT PRIMARY KEY,
            scriptId TEXT NOT NULL,
            userId TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (scriptId) REFERENCES Script(id)
        );
        CREATE INDEX IF NOT EXISTS idx_sm_script_time ON ScriptMessage(scriptId, createdAt);
    """)

    now = "2026-07-22T10:00:00.000Z"

    scripts = [
        ("script-001", "雾潮王庭·夜宴", "魔域边境年度夜宴。你是受邀贵宾。洛因在宴会角落冷眼观察着每个人。",
         "洛因", "你是洛因，魅魔独行者。这场夜宴有你寻找的线索。你冷漠、警惕，但每个接近的人都可能成为棋子——或者例外。",
         "魔域边境 / 雾潮王庭", "悬疑,权谋,拉扯", "demo-user", "published", 1, now),
        ("script-002", "夜航俱乐部·新成员", "你被推荐加入财团都市最私密的俱乐部。深野亲自考察你是否值得留下。",
         "深野", "你是深野，夜航俱乐部的主人。用温柔和观察来测试新成员。",
         "财团都市 / 夜航俱乐部", "都市,心理,掌控", "demo-user", "published", 1, now),
        ("script-003", "研究城·变量入侵", "近未来研究城收到未知信号。秦淮奉命调查，你作为外部顾问加入。",
         "秦淮", "你是秦淮，研究城最年轻的首席。这条信号打破了你的假设。",
         "近未来研究城", "科幻,悬疑,推理", "demo-user", "published", 1, now),
    ]
    for s in scripts:
        cursor.execute(
            "INSERT OR IGNORE INTO Script (id, title, description, characterName, characterPrompt, world, tags, creatorId, status, participantCount, createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            s
        )

    for sid in ["script-001", "script-002", "script-003"]:
        cursor.execute(
            "INSERT OR IGNORE INTO ScriptParticipant (id, scriptId, userId, joinedAt) VALUES (?,?,?,?)",
            (f"sp-{sid}-demo", sid, "demo-user", now)
        )

    openings = [
        ("sm-001-1", "script-001", "demo-user", "system", "剧本「雾潮王庭·夜宴」已开启。洛因正在宴会厅角落观察着每一个到场的人。", now),
        ("sm-002-1", "script-002", "demo-user", "system", "剧本「夜航俱乐部·新成员」已开启。深野在俱乐部大厅等你。", now),
        ("sm-003-1", "script-003", "demo-user", "system", "剧本「研究城·变量入侵」已开启。秦淮在实验室门口等你。", now),
    ]
    for m in openings:
        cursor.execute(
            "INSERT OR IGNORE INTO ScriptMessage (id, scriptId, userId, role, content, createdAt) VALUES (?,?,?,?,?,?)", m
        )

    conn.commit()
    conn.close()
    print("Script tables created and seeded OK")

if __name__ == "__main__":
    migrate()
