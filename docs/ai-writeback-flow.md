# AI writeback flow

## 新增数据模型

- `StoryTrigger`：剧情节点触发条件
- `AiWriteback`：AI 回写记录

## 回写链路建议

1. 用户发出消息
2. `ConversationsService` 读取当前会话与上下文
3. AI 服务返回：
   - reply message
   - relationship delta
   - memory summary
   - triggered story node
4. API 层写入：
   - `Message`
   - `RelationshipState`
   - `MemoryEntry`
   - `AiWriteback`
5. 前端刷新：
   - 新回复
   - 关系变化
   - 新记忆
   - 新剧情节点

## 当前意义

现在数据库模型已经能承载从“读”到“回写”的完整闭环。
