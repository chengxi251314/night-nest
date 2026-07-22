# Backend chain closed loop

截至 2026-07-21，后端主体验链已经形成统一结构：

- CharactersService -> CharactersRepository
- RelationshipsService -> RelationshipsRepository
- ConversationsService -> ConversationsRepository
- MemoriesService -> MemoriesRepository
- StoryService -> StoryRepository

## 当前闭环能力

- 角色读取
- 关系状态读取
- 会话与消息读取
- 关键记忆读取
- 当前章节读取

## 意义

这意味着主体验链的服务边界已经稳定，
后续从 seed 切换到 Prisma Client 时，只需要替换 repository 内部实现。

## 下一步建议

- repository 内部切 Prisma
- 增加 `StoryTrigger` 与 `MemoryWrite` 结构
- 接 AI 服务回写 message / memory / relationship
