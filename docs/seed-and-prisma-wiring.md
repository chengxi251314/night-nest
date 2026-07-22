# Seed and Prisma wiring

## 新增内容

- `prisma/seed/seed-data.ts`：首版角色与关系种子
- `prisma/seed/seed.ts`：种子预览入口
- `src/database/prisma.service.ts`：Prisma service 占位
- `src/database/repositories/*`：仓储层占位

## 当前形态

服务层已经不再直接内嵌假数据，
而是通过 repository 读取 seed 数据，结构上更接近真实持久化。

## 下一步

- 用 Prisma Client 替换 repository 内部 seed 读取
- 给 `demo-user` 补真实 User seed
- 给 conversations / messages 增加 seed 与 repository
