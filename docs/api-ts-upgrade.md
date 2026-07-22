# TypeScript API Upgrade

## 完成内容

- 新增 `main.ts`、`app.controller.ts`、`app.service.ts`
- 各模块新增 TypeScript service
- 新增 DTO 占位结构
- 新增共享接口契约：`packages/config/contracts/api.ts`

## 当前状态

- 已具备 Nest 风格目录组织
- 仍是轻量手写入口，不依赖 Nest 包
- 已为后续正式迁移 NestJS 留出路径

## 下一步

- 安装 NestJS 依赖
- 替换控制器与服务为装饰器风格
- 引入 DTO 校验与模块注册
