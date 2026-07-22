# Service to persistence mapping

## CharactersService

- 读取表：`Character`
- 后续补充：角色标签、角色资源、角色限制规则

## ConversationsService

- 读取表：`Conversation`
- 写入表：`Message`
- 后续关联：AI 服务返回回复后写入一条 character message

## RelationshipsService

- 读取 / 更新表：`RelationshipState`
- 用于维护关系分数、阶段、当前情绪

## MemoriesService

- 读取 / 写入表：`MemoryEntry`
- 负责沉淀高价值互动摘要

## StoryService

- 读取表：`StoryNode`
- 后续补充：剧情触发器表、剧情分支表
