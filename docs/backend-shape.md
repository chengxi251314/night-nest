# Backend shape update

## 当前后端形状

- `app.module.ts` 作为应用装配入口
- 每个业务域具备 `module / controller / service / dto`
- 关键实体已开始用 `entities` 目录占位
- 数据库初稿在 `apps/api/src/database/schema.sql`

## 说明

这仍然不是安装了 NestJS 依赖的可运行 Nest 项目，
但文件结构已经按照 NestJS 的真实组织方式推进，便于下一步直接迁移。

## 下一步

- 引入真正的 `@Module @Controller @Injectable`
- 引入 ORM（建议 Prisma 或 TypeORM）
- 把 `schema.sql` 转为正式迁移文件
