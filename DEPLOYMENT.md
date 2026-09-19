# 个人工作台上线与部署指南 (Deployment Guide)

本项目已精简为纯粹、全功能解锁的个人生产力工作台，去除了所有收费门槛和套餐限制，支持极速一键部署。

---

## 本地运行

本地开发端口已调整为 **`5188`**（避开 5173 等常规被占用端口）：

```bash
# 安装依赖
npm install

# 启动本地服务 (访问 http://localhost:5188)
npm run dev
```

---

## 方案一：Vercel 一键上线部署（强烈推荐，最简单免费）

1. 将本项目推送到您的 GitHub / GitLab 仓库。
2. 登录 [Vercel](https://vercel.com/)，点击 **Add New Project** 并选择该仓库。
3. 构建参数保持默认即可：
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. （可选）在 **Environment Variables** 添加：
   - `VITE_GEMINI_API_KEY`: 您的 Gemini API Key（配置后全站免手动输入 Key）
   - `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`（如需多端云同步）
5. 点击 **Deploy**，约 1 分钟即可生成专属 HTTPS 访问域名。
> 项目根目录已内置 `vercel.json`，已自动配置 SPA 路由重定向规则，页面刷新不会出现 404。

---

## 方案二：Netlify 一键部署

1. 登录 [Netlify](https://www.netlify.com/)，点击 **Add new site** -> **Import an existing project**。
2. 构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. 在 `public/_redirects` 或 Netlify 后台添加重定向规则：
   ```
   /*    /index.html   200
   ```
4. 点击 **Deploy site** 即完成上线。

---

## 方案三：Docker / Nginx 自托管部署

### 1. 本地或服务器构建产物
```bash
npm run build
```
执行后会在根目录生成静态资源目录 `dist/`。

### 2. Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist;
    index index.html;

    # 关键：支持 SPA 页面路由正常跳转
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态文件缓存加速
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 机器人与外部连接（Hermes Agent）

在左侧导航栏或顶部导航点击 **🤖 Hermes 连接**，即可查看：
- **MCP 8644 连接配置**
- **Webhook 推送地址**
- **跨端 Agent 授权 Token**

可以在 Telegram、微信或自建 Agent 中无缝同步和唤醒工作台任务。
