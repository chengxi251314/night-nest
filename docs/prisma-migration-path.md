# Prisma migration path

## 当前状态

截至 2026-07-21，项目已经拥有：

- `schema.sql` 数据库草案
- `schema.prisma` Prisma 数据模型草案
- API 模块与 DTO 骨架

## 下一步建议

1. 安装 Prisma CLI 与 client
2. 配置 `DATABASE_URL`
3. 运行第一次迁移
4. 生成 Prisma Client
5. 在 `CharactersService / ConversationsService / RelationshipsService` 接入真实查询

## 建议优先顺序

- 第一步接 `Character`
- 第二步接 `RelationshipState`
- 第三步接 `Conversation + Message`
- 第四步接 `MemoryEntry`
- 第五步接 `StoryNode`
