export const seedUsers = [
  { id: "demo-user", email: "demo@nightnest.local", createdAt: "2026-07-21T08:00:00Z" }
];

export const seedCharacters = [
  { id: "luoyin", name: "洛因", title: "危险而克制的魅魔独行者", world: "魔域边境 / 雾潮王庭" },
  { id: "shenye", name: "深野", title: "温柔外壳下的掌控型保护者", world: "财团都市 / 夜航俱乐部" },
  { id: "qinhuai", name: "秦淮", title: "冷感天才与迟到的心动", world: "近未来研究城" }
];

export const seedRelationships = [
  { userId: "demo-user", characterId: "luoyin", score: 18, stage: "试探期", mood: "克制" },
  { userId: "demo-user", characterId: "shenye", score: 12, stage: "熟悉期", mood: "从容" },
  { userId: "demo-user", characterId: "qinhuai", score: 10, stage: "观察期", mood: "冷静" }
];

export const seedConversations = [
  { id: "conv-luoyin-001", userId: "demo-user", characterId: "luoyin", status: "active", createdAt: "2026-07-21T08:10:00Z" },
  { id: "conv-shenye-001", userId: "demo-user", characterId: "shenye", status: "active", createdAt: "2026-07-21T08:15:00Z" },
  { id: "conv-qinhuai-001", userId: "demo-user", characterId: "qinhuai", status: "active", createdAt: "2026-07-21T08:20:00Z" }
];

export const seedMessages = [
  { id: "msg-luoyin-system-001", conversationId: "conv-luoyin-001", role: "system", content: "角色已载入：luoyin", createdAt: "2026-07-21T08:10:10Z" },
  { id: "msg-luoyin-char-001", conversationId: "conv-luoyin-001", role: "character", content: "又来了？既然没走，那就坐近一点。别让我抬头找你。", createdAt: "2026-07-21T08:10:20Z" },
  { id: "msg-shenye-system-001", conversationId: "conv-shenye-001", role: "system", content: "角色已载入：shenye", createdAt: "2026-07-21T08:15:10Z" },
  { id: "msg-shenye-char-001", conversationId: "conv-shenye-001", role: "character", content: "你来的时间刚刚好。先把呼吸放慢一点，再告诉我今天是谁让你不开心。", createdAt: "2026-07-21T08:15:20Z" },
  { id: "msg-qinhuai-system-001", conversationId: "conv-qinhuai-001", role: "system", content: "角色已载入：qinhuai", createdAt: "2026-07-21T08:20:10Z" },
  { id: "msg-qinhuai-char-001", conversationId: "conv-qinhuai-001", role: "character", content: "如果你想留下，我可以为你空出今晚的实验记录时间。", createdAt: "2026-07-21T08:20:20Z" }
];

export const seedMemories = [
  { id: "mem-luoyin-001", userId: "demo-user", characterId: "luoyin", summary: "你第一次没有被他的危险感逼退。", weight: 2, createdAt: "2026-07-21T08:30:00Z" },
  { id: "mem-luoyin-002", userId: "demo-user", characterId: "luoyin", summary: "他开始记住你疲惫时的语气变化。", weight: 1, createdAt: "2026-07-21T08:32:00Z" },
  { id: "mem-shenye-001", userId: "demo-user", characterId: "shenye", summary: "他记住了你习惯先说没事再说真话。", weight: 1, createdAt: "2026-07-21T08:35:00Z" },
  { id: "mem-qinhuai-001", userId: "demo-user", characterId: "qinhuai", summary: "他第一次为你暂停了模型运算。", weight: 1, createdAt: "2026-07-21T08:40:00Z" }
];

export const seedStoryNodes = [
  { id: "story-luoyin-001", characterId: "luoyin", title: "第 01 章 · 夜色试探", body: "第一步不是进攻，而是让他确认你不会把靠近当成游戏。", chapterOrder: 1 },
  { id: "story-shenye-001", characterId: "shenye", title: "第 01 章 · 柔软接管", body: "先享受照顾，还是先试探边界？这是这条关系线的第一步。", chapterOrder: 1 },
  { id: "story-qinhuai-001", characterId: "qinhuai", title: "第 01 章 · 变量接近", body: "你要做的，是让他继续失衡。", chapterOrder: 1 }
];

export const seedStoryTriggers = [
  { id: "trigger-luoyin-001", characterId: "luoyin", storyNodeId: "story-luoyin-001", triggerType: "relationship", conditionKey: "score_gte", conditionValue: "18" },
  { id: "trigger-shenye-001", characterId: "shenye", storyNodeId: "story-shenye-001", triggerType: "relationship", conditionKey: "score_gte", conditionValue: "12" },
  { id: "trigger-qinhuai-001", characterId: "qinhuai", storyNodeId: "story-qinhuai-001", triggerType: "relationship", conditionKey: "score_gte", conditionValue: "10" }
];

export const seedAiWritebacks = [
  { id: "writeback-001", userId: "demo-user", characterId: "luoyin", conversationId: "conv-luoyin-001", relationshipDelta: 2, memorySummary: "你第一次主动安抚了他的戒备。", triggeredNodeId: "story-luoyin-001", createdAt: "2026-07-21T08:45:00Z" }
];
