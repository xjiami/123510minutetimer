# Cloudflare Pages 部署指南

## 准备工作

1. 在 GitHub 上创建一个仓库并将代码推送到该仓库

```bash
# 初始化git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 创建main分支
git branch -M main

# 添加远程仓库
git remote add origin https://github.com/你的用户名/仓库名称.git

# 推送代码到远程仓库
git push -u origin main
```

2. 注册 Cloudflare 账号并获取必要的API密钥

## 手动部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 "Pages"
3. 点击 "创建项目"
4. 选择 "连接到 Git"
5. 授权 GitHub 并选择你的仓库
6. 配置构建设置:
   - 构建命令: `npm run build`
   - 构建输出目录: `dist`
   - 环境变量: 根据需要添加
7. 点击 "保存并部署"

## 通过 GitHub Actions 自动部署

如果你想通过 GitHub Actions 自动部署，需要在仓库中设置以下 Secrets:

1. `CLOUDFLARE_API_TOKEN` - 从 Cloudflare 获取的 API 令牌
2. `CLOUDFLARE_ACCOUNT_ID` - 你的 Cloudflare 账户 ID

### 获取 Cloudflare API 令牌

1. 登录 Cloudflare Dashboard
2. 点击右上角的个人资料，然后点击 "我的个人资料"
3. 导航到 "API 令牌" 选项卡
4. 点击 "创建令牌"
5. 选择 "编辑 Cloudflare Pages" 模板
6. 设置令牌名称和过期时间
7. 设置账户权限为 "Cloudflare Pages:Edit"
8. 点击 "创建令牌"
9. 复制生成的令牌

### 获取 Cloudflare 账户 ID

1. 登录 Cloudflare Dashboard
2. 账户 ID 显示在右上角或概述页面的右侧

### 在 GitHub 中设置 Secrets

1. 打开你的 GitHub 仓库
2. 点击 "Settings"
3. 在左侧菜单中点击 "Secrets and variables" > "Actions"
4. 点击 "New repository secret" 按钮
5. 分别添加 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID` 两个 Secrets

设置好这些 Secrets 后，每次推送到 `main` 分支时，GitHub Actions 就会自动构建并部署你的应用到 Cloudflare Pages。

## 自定义域名设置

1. 在 Cloudflare Pages 项目中点击 "自定义域"
2. 点击 "设置自定义域"
3. 输入你想要使用的域名
4. 按照提示完成 DNS 配置 