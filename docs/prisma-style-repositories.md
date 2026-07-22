# Prisma-style repository status

## 统一结果

所有 repository 现在都具备两层结构：

- 外层：service 调用 repository
- 内层：repository 调用 PrismaService，未连接时回退到 seed

## 已覆盖

- CharactersRepository
- RelationshipsRepository
- ConversationsRepository
- MemoriesRepository
- StoryRepository

## 这意味着

当 Prisma 真正接入后，只需要把 `PrismaService` 的方法实现补上，
以及把 `status` 从 `prepared` 变成真实连接态即可。
