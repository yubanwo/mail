# Mail Worker

Cloudflare Worker 全栈邮件后台：Worker 负责鉴权、D1 邮件接口和 Email Routing 入库，Vite + React 负责后台页面。

## 目录结构

```txt
src/client/main.jsx             React 入口
src/client/app/                 前端应用编排
src/client/layout/              前端布局组件
src/client/features/            登录、账户和邮件功能视图
src/client/shared/api/          前端 API client
src/client/shared/hooks/        前端状态持久化 hooks
src/client/shared/lib/          前端通用工具库
src/client/shared/ui/           前端通用 UI 组件
src/client/shared/utils/        前端格式化工具
src/worker/index.js             Worker fetch/email 入口
src/worker/app.js               HTTP 路由和统一错误处理
src/worker/config.js            Worker 常量配置
src/worker/db/                  D1 binding 检查
src/worker/http/                HTTP 请求、响应、错误和轻量路由
src/worker/modules/auth/        注册、登录、token、密码、鉴权、路由和 SQL
src/worker/modules/emails/      邮件查询、MIME 解析、路由、SQL 和 Email Routing 入库
src/worker/utils/               通用编码、加密、日期和规范化工具
migrations/                     D1 SQL
wrangler.toml                   Cloudflare 配置
vite.config.js                  Vite + Tailwind + Cloudflare 插件配置
```

## 本地开发

需要 Node.js 22 或更高版本。最新 Wrangler / Miniflare 已要求 Node 22。

```bash
npm install
npm run db:migrate:local
npm run dev
```

本地地址：

```txt
http://127.0.0.1:5173/
```

## 必要配置

先在 `wrangler.toml` 里替换 D1 的 `database_id`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "mail"
database_id = "your-d1-database-id"
```

设置 JWT 密钥：

```bash
wrangler secret put JWT_SECRET
```

本地开发可以使用 `.dev.vars`：

```txt
JWT_SECRET=local-development-secret-change-me
ALLOW_REGISTER=true
```

初始化或更新 D1 表：

```bash
npm run db:migrate:local
```

部署前初始化或更新远程 D1 表：

```bash
npm run db:migrate:remote
```

## 部署

```bash
npm run deploy
```

## 路由

- `/`：邮件后台前端
- `/auth/register`：注册，默认只允许第一个用户
- `/auth/login`：登录
- `/auth/refresh`：刷新 token
- `/auth/logout`：注销 refresh token
- `/me`：当前用户
- `PATCH /me`：修改当前管理员用户名或密码
- `/emails`：邮件列表
- `/emails/:id`：邮件详情
- `/health`：健康检查

## API 响应格式

成功响应：

```json
{
  "ok": true,
  "data": {}
}
```

错误响应：

```json
{
  "ok": false,
  "error": {
    "message": "Invalid username or password."
  }
}
```

前端会自动解包 `data`，并兼容旧的非 envelope JSON。

如果要开放后续注册，在 Worker 环境变量里设置：

```txt
ALLOW_REGISTER=true
```
