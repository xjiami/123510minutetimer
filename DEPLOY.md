# 部署指南：将项目部署到Cloudflare Pages

## 手动部署步骤

### 1. 准备工作

确保你已经：
- 注册了GitHub账号
- 注册了Cloudflare账号
- 已经构建了项目（运行`npm run build`生成dist目录）

### 2. 创建GitHub仓库并上传代码

```bash
# 初始化git仓库（如果尚未初始化）
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 创建main分支
git branch -M main

# 添加远程仓库（替换为你的GitHub用户名和仓库名）
git remote add origin https://github.com/你的用户名/仓库名称.git

# 推送代码到远程仓库
git push -u origin main
```

### 3. 在Cloudflare Pages上部署

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

## 自动部署（可选）

项目已包含GitHub Actions配置文件，可以实现自动部署。你需要在GitHub仓库中设置以下Secrets:

1. `CLOUDFLARE_API_TOKEN` - 从Cloudflare获取的API令牌
2. `CLOUDFLARE_ACCOUNT_ID` - 你的Cloudflare账户ID

### 获取Cloudflare API令牌

1. 登录Cloudflare Dashboard
2. 点击右上角的个人资料图标，然后选择"我的个人资料"
3. 选择"API令牌"选项卡
4. 点击"创建令牌"
5. 选择"编辑Cloudflare Workers"模板
6. 确保包含Pages权限
7. 创建令牌并复制

### 获取Cloudflare账户ID

1. 登录Cloudflare Dashboard
2. 账户ID显示在右侧边栏底部或概览页面

## 注意事项

- 确保dist目录中包含_redirects文件，内容为：`/* /index.html 200`，这对于SPA路由很重要
- 部署后，Cloudflare会提供一个*.pages.dev的URL访问你的网站
- 你可以在Cloudflare Pages设置中配置自定义域名