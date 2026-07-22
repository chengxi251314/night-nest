# Conversation persistence progress

## 本轮新增

- `seedUsers`
- `seedConversations`
- `seedMessages`
- `ConversationsRepository`
- `ConversationsService` 改为通过 repository 获取种子会话与消息

## 当前意义

会话链路已经开始具备完整的数据结构：

- 用户
- 角色
- 关系
- 会话
- 消息

这让下一步接 Prisma Client 时，不需要再重构服务边界。

## 下一步建议

- 增加 `MemoriesRepository`
- 增加 `StoryRepository`
- 引入 `PrismaService` 真正查询
- 把 `demo-user` 改成真实 User 表数据读取
