# Mail Worker

把自己的域名变成一个轻量、私有、可部署到 Cloudflare Workers 的收件后台。

Mail Worker 可以接收 Cloudflare Email Routing 转发来的邮件，自动解析标题、发件人、收件人和正文，保存到 D1 数据库，并提供一个网页后台用来登录、筛选和查看邮件。它适合临时邮箱、验证码收件箱、个人项目入站邮件归档，或者任何你想自己掌控的域名收件场景。

## 亮点

- 一次部署，前端页面和 API 都跑在 Cloudflare Workers 上
- 使用 Cloudflare Email Routing 接收发往你域名的邮件
- 使用 D1 保存邮件和管理员账号，不需要额外服务器
- 支持解析纯文本邮件，也会把 HTML 邮件转换成可读文本
- 支持登录、退出、刷新 token 和修改账号信息
- 支持按收件人筛选邮件，适合一个域名下配置多个地址
- 首个管理员注册后，默认关闭后续注册，更适合个人私有使用

## 适合谁用

如果你有一个已经接入 Cloudflare 的域名，想要一个简单、干净、自己可控的收件后台，它就很合适。

常见用法：

- 临时邮箱：例如 `test@example.com`、`demo@example.com`
- 验证码收件：给测试环境、自动化流程或个人项目接验证码
- 项目邮箱：把产品反馈、系统通知、Webhook 邮件集中保存
- 域名收件箱：不用搭邮件服务器，也能查看发到域名地址的邮件

## 工作方式

```txt
发件人
  -> Cloudflare Email Routing
  -> Mail Worker
  -> D1 数据库
  -> 网页后台查看邮件
```

你只需要准备一个 Cloudflare 域名、一份 D1 数据库和这个 Worker。邮件进入 Worker 后会被解析并保存，之后登录后台就能查看列表和详情。

## 准备工作

开始前需要：

- 一个 Cloudflare 账号
- 一个已经接入 Cloudflare 的域名
- 一个 Cloudflare D1 数据库
- Node.js 22 或更高版本
- 已登录 Cloudflare 的 Wrangler CLI

安装依赖：

```bash
npm install
```

## 快速开始

1. 创建 D1 数据库

   在 Cloudflare 控制台创建一个 D1 数据库，例如 `mail`。

2. 配置 `wrangler.toml`

   把 D1 配置改成你的数据库信息：

   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "mail"
   database_id = "your-d1-database-id"
   ```

   `binding` 必须保持为 `DB`，应用会通过这个名字访问数据库。

3. 配置本地密钥

   本地开发可以创建 `.dev.vars`：

   ```txt
   JWT_SECRET=local-development-secret-change-me
   ALLOW_REGISTER=true
   ```

   `.dev.vars` 已经在 `.gitignore` 中，不要上传到 GitHub。

4. 初始化本地数据库

   ```bash
   npm run db:migrate:local
   ```

5. 启动本地服务

   ```bash
   npm run dev
   ```

   打开：

   ```txt
   http://127.0.0.1:5173/
   ```

   首次注册会创建管理员账号。默认情况下，如果系统里已经有用户，后续注册会被关闭。

## 部署到 Cloudflare

按照下面步骤把项目部署到 Cloudflare Workers。

1. 登录 Wrangler

   ```bash
   npx wrangler login
   ```

   登录完成后可以确认账号状态：

   ```bash
   npx wrangler whoami
   ```

2. 检查 D1 配置

   确认 `wrangler.toml` 中的数据库信息正确：

   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "mail"
   database_id = "your-d1-database-id"
   ```

   如果准备把仓库公开到 GitHub，建议不要提交真实的 `database_id`，可以保留占位符，然后在部署环境或本地配置里填入真实值。

3. 设置线上 JWT 密钥

   ```bash
   npx wrangler secret put JWT_SECRET
   ```

   按提示输入一段足够长的随机字符串。这个密钥用于签发登录 token，线上环境必须设置。

4. 初始化线上 D1 数据库

   ```bash
   npm run db:migrate:remote
   ```

   如果数据库已经初始化过，一般不需要重复执行同一个迁移。

5. 构建并部署 Worker

   ```bash
   npm run deploy
   ```

   这个命令会先构建前端资源，再把 Worker 部署到 Cloudflare。

6. 检查部署结果

   部署完成后，在 Cloudflare Workers 控制台确认：

   - Worker 已绑定 D1，绑定名为 `DB`
   - `JWT_SECRET` 已设置
   - Worker 域名可以正常访问
   - 打开 Worker 地址后能看到登录页面

## 配置收信

在 Cloudflare 控制台进入你的域名，打开 Email Routing。

新增一条路由规则，把目标邮箱地址转发到这个 Worker：

```txt
anything@example.com -> mail-worker
```

之后给这个地址发送邮件，登录后台刷新列表即可查看。

如果你配置了多个地址，例如：

```txt
code@example.com -> mail-worker
login@example.com -> mail-worker
notice@example.com -> mail-worker
```

后台可以按收件人筛选，方便快速找到指定地址收到的邮件。

## 首次使用流程

第一次完整跑通可以按这个顺序来：

1. 创建 D1 数据库
2. 修改 `wrangler.toml`
3. 设置 `JWT_SECRET`
4. 执行 `npm run db:migrate:remote`
5. 执行 `npm run deploy`
6. 在 Email Routing 中把邮箱地址转发到 Worker
7. 打开 Worker 地址，注册第一个管理员
8. 给配置的邮箱发一封测试邮件
9. 回到后台刷新邮件列表

能看到测试邮件，就说明部署和收信都已经正常。

## 常用命令

```bash
npm run dev
npm run build
npm run deploy
npm run check
npm run db:migrate:local
npm run db:migrate:remote
```

命令说明：

- `npm run dev`：启动本地开发服务
- `npm run build`：构建前端资源
- `npm run deploy`：构建并部署到 Cloudflare Workers
- `npm run check`：检查 Worker 入口脚本语法
- `npm run db:migrate:local`：初始化本地 D1 数据库
- `npm run db:migrate:remote`：初始化线上 D1 数据库

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
