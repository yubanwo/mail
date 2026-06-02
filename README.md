# Mail Worker

一个部署在 Cloudflare Workers 上的轻量邮件收件后台。它可以配合 Cloudflare Email Routing 接收发往你域名的邮件，把邮件存进 D1 数据库，并提供一个网页后台用来登录、筛选和查看邮件内容。

适合用来搭建自己的临时邮箱、域名收件箱、验证码收件后台，或给个人项目保存入站邮件。

## 功能

- 接收 Cloudflare Email Routing 转发过来的邮件
- 自动解析邮件标题、发件人、收件人和正文
- 支持纯文本邮件，也会把 HTML 邮件转换成可读文本
- 使用 D1 保存邮件和管理员账号
- 提供登录、退出、刷新 token 和修改账号信息
- 支持按收件人筛选邮件
- 前端和 API 一起部署到 Cloudflare Workers

## 准备

你需要准备：

- 一个 Cloudflare 账号
- 一个已接入 Cloudflare 的域名
- 一个 Cloudflare D1 数据库
- Node.js 22 或更高版本
- Wrangler CLI 登录到你的 Cloudflare 账号

安装依赖：

```bash
npm install
```

## 配置 D1

在 Cloudflare 控制台创建一个 D1 数据库，例如 `mail`。

然后把 `wrangler.toml` 里的 D1 配置改成你的数据库信息：

```toml
[[d1_databases]]
binding = "DB"
database_name = "mail"
database_id = "your-d1-database-id"
```

`binding` 必须保持为 `DB`，应用会通过这个名字访问数据库。

如果你准备把仓库公开到 GitHub，建议不要提交真实的 `database_id`，可以保留占位符，然后在部署环境或本地配置里填入真实值。

## 初始化数据库

本地开发数据库：

```bash
npm run db:migrate:local
```

线上 D1 数据库：

```bash
npm run db:migrate:remote
```

## 配置密钥

线上部署前设置 JWT 密钥：

```bash
wrangler secret put JWT_SECRET
```

本地开发可以创建 `.dev.vars`：

```txt
JWT_SECRET=local-development-secret-change-me
ALLOW_REGISTER=true
```

`.dev.vars` 已经在 `.gitignore` 中，不要上传到 GitHub。

## 本地运行

```bash
npm run dev
```

打开：

```txt
http://127.0.0.1:5173/
```

首次注册会创建管理员账号。默认情况下，如果系统里已经有用户，后续注册会被关闭。

如果你确实要开放后续注册，可以设置：

```txt
ALLOW_REGISTER=true
```

## 部署

```bash
npm run deploy
```

部署完成后，在 Cloudflare Workers 控制台确认：

- Worker 已绑定 D1，绑定名为 `DB`
- `JWT_SECRET` 已设置
- 你的 Worker 域名可以正常访问

## 配置收信

在 Cloudflare 控制台进入你的域名，打开 Email Routing。

创建一条路由规则，把目标地址转发到这个 Worker。之后发到该地址的邮件会进入后台。

例如：

```txt
anything@example.com -> mail-worker
```

收到邮件后，登录后台即可查看邮件列表和详情。

## 常用命令

```bash
npm run dev
npm run build
npm run deploy
npm run check
npm run db:migrate:local
npm run db:migrate:remote
```

## 安全提醒

- 不要提交 `.dev.vars`
- 不要提交真实 JWT 密钥
- 公开仓库里建议不要放真实 D1 `database_id`
- 部署后请使用足够强的管理员密码
- 如果只是个人收件后台，不建议长期开放 `ALLOW_REGISTER`

## 技术栈

- Cloudflare Workers
- Cloudflare D1
- Cloudflare Email Routing
- Vite
- React
- Hono
- postal-mime
