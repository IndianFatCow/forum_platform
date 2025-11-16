# 南邮论坛 🚀

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.4.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg)
![Element Plus](https://img.shields.io/badge/Element%20Plus-latest-409EFF.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

一个基于 Vue 3 + TypeScript 的现代BBS论坛系统

[在线演示](#在线演示链接) | [功能特性](#功能特性) | [快速开始](#快速开始) | [项目结构](#项目结构)

</div>

---

## 📖 项目简介

南邮论坛 本站是一个面向南邮师生的社区论坛系统，提供用户注册与登录、板块管理、帖子发布与管理、评论与回复、搜索等功能， 旨在为用户提供一个高效、便捷、丰富的校园交流平台。

### ✨ 功能特性

#### 🔐 用户管理
- ✅ 用户注册与登录（JWT 认证）
- ✅ 个人信息管理（头像、资料编辑）
- ✅ 密码重置功能
- ✅ 用户主页与社交功能
- ✅ 管理员后台（用户管理、权限控制）

#### 📝 内容管理
- ✅ Markdown 富文本编辑器
- ✅ 文章发布与编辑
- ✅ 板块分类管理
- ✅ 文章搜索与筛选
- ✅ 热门推荐算法

#### 💬 社交互动
- ✅ 文章评论系统（支持多级回复）
- ✅ 点赞与收藏功能
- ✅ 实时消息通知（WebSocket）
- ✅ 通知中心
- ✅ 用户关注系统

#### 🎨 用户体验
- ✅ 响应式设计（支持移动端）
- ✅ 暗色模式支持
- ✅ 骨架屏加载
- ✅ 图片懒加载
- ✅ 无限滚动分页

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0（或使用 pnpm / yarn）

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/IndianFatCow/forum_platform.git

# 进入项目目录
 cd .\forum_platform\

# 安装依赖
npm install
```

### 开发环境运行

```bash
# 启动开发服务器（默认端口：5173）
npm run dev
```

浏览器访问：`http://localhost:5173`


## 🛠️ 技术栈

### 核心框架
- **Vue 3.4+** - 渐进式 JavaScript 框架
- **TypeScript 5.0+** - JavaScript 的超集，提供类型安全
- **Vite 5.0+** - 下一代前端构建工具

### UI 组件库
- **Element Plus** - 基于 Vue 3 的组件库
- **@element-plus/icons-vue** - Element Plus 图标库
- **@icon-park/vue-next** - 字节跳动图标库

### 状态管理 & 路由
- **Pinia** - Vue 官方推荐的状态管理库
- **Vue Router 4** - Vue 官方路由管理器
- **pinia-plugin-persistedstate** - Pinia 状态持久化插件

### 网络请求
- **Axios** - 基于 Promise 的 HTTP 客户端
- **WebSocket** - 实时双向通信

### 富文本编辑
- **@vueup/vue-quill** - Quill 编辑器的 Vue 3 封装
- **markdown-it** - Markdown 解析器

### 工具库
- **lodash-es** - JavaScript 实用工具库
- **dayjs** - 轻量级日期处理库

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0（或使用 pnpm / yarn）

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/IndianFatCow/forum_platform.git

# 进入项目目录
 cd .\forum_platform\

# 安装依赖
npm install
```

### 开发环境运行

```bash
# 启动开发服务器（默认端口：5173）
npm run dev
```

浏览器访问：`http://localhost:5173`



---

## 📁 项目结构

```
algohub-ts/
├── public/                  # 静态资源
│   └── default.png         # 默认头像
├── src/
│   ├── api/                # API 接口封装
│   │   ├── user.ts        # 用户相关接口
│   │   ├── post.ts        # 帖子相关接口
│   │   ├── boards.ts      # 板块相关接口
│   │   ├── comments.ts    # 评论相关接口
│   │   ├── like.ts        # 点赞收藏接口
│   │   └── notifications.ts # 通知接口
│   ├── assets/            # 资源文件
│   │   └── styles/        # 全局样式
│   ├── components/        # 公共组件
│   │   ├── NotificationCenter.vue  # 通知中心
│   │   ├── MarkdownEditor.vue      # Markdown编辑器
│   │   └── commentsCard.vue        # 评论组件
│   ├── router/            # 路由配置
│   │   └── index.ts       # 路由定义与守卫
│   ├── stores/            # Pinia 状态管理
│   │   ├── user.ts        # 用户状态
│   │   ├── token.ts       # Token管理
│   │   ├── postStore.ts   # 帖子状态
│   │   └── notificationStore.ts # 通知状态
│   ├── utils/             # 工具函数
│   │   └── request.ts     # Axios 封装
│   ├── views/             # 页面组件
│   │   ├── Login.vue      # 登录注册页
│   │   ├── home.vue       # 首页
│   │   ├── boards.vue     # 板块页
│   │   ├── blogDetail.vue # 文章详情
│   │   ├── edit_post.vue  # 文章编辑
│   │   ├── userCenter/    # 个人中心
│   │   │   ├── UserInfo.vue
│   │   │   ├── UserAvatar.vue
│   │   │   └── UserResetPassword.vue
│   │   ├── userProfile/   # 用户主页
│   │   │   ├── otherProfile.vue
│   │   │   └── userList.vue
│   │   └── admin/         # 管理后台
│   │       └── adminUserList.vue
│   ├── App.vue            # 根组件
│   ├── main.ts            # 入口文件
│   └── vite-env.d.ts      # Vite 类型定义
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── index.html             # HTML 模板
├── package.json           # 项目依赖
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── README.md              # 项目说明
```

---

## ⚙️ 配置说明

### 环境变量

创建 `.env.development` 和 `.env.production` 文件：

```env
# .env.development
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080

# .env.production
VITE_API_BASE_URL=https://api.your-domain.com
VITE_WS_URL=wss://api.your-domain.com
```

### Vite 配置

`vite.config.ts` 中已配置：
- ✅ 跨域代理（开发环境）
- ✅ 路径别名（`@` 指向 `src`）
- ✅ 生产环境优化

### API 请求配置

所有 API 请求通过 `utils/request.ts` 统一处理：
- ✅ 自动注入 Token
- ✅ 统一错误处理
- ✅ 响应拦截器

---

## 🎯 核心功能实现

### 1. 用户认证流程

```typescript
// 登录成功后
const userStore = useUserStore()
userStore.setUserInfo(response.data.userInfo)
localStorage.setItem('token', response.data.token)

// 请求拦截器自动携带 Token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 2. 路由守卫

```typescript
// 白名单：无需登录的页面
const whiteList = ['/login', '/register', '/help']

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (whiteList.includes(to.path) || userStore.isLogin) {
    next()
  } else {
    next({ path: '/login', query: { redirect: to.fullPath } })
  }
})
```

### 3. WebSocket 实时通知

```typescript
// 建立连接
const ws = new WebSocket(`${WS_URL}?token=${token}`)

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data)
  notificationStore.addNotification(notification)
}
```

---

## 🔧 开发指南

### 推荐 IDE 配置

- **VSCode** + **Volar** 插件
- 禁用 Vetur（与 Volar 冲突）

### 代码规范

```bash
# ESLint 检查
npm run lint

# Prettier 格式化
npm run format
```

### 类型检查

```bash
# 运行类型检查
npm run type-check
```

---

## 📸 项目截图

<details>
<summary>点击展开查看截图</summary>

### 首页
![首页](./screenshots/home.png)

### 文章详情
![文章详情](./screenshots/detail.png)

### 个人中心
![个人中心](./screenshots/profile.png)

### 管理后台
![管理后台](./screenshots/admin.png)

</details>

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📝 更新日志

### v1.0.0 (2024-01-15)
- ✨ 初始版本发布
- ✅ 完成核心功能开发
- ✅ 用户认证系统
- ✅ 内容管理系统
- ✅ 社交互动功能
- ✅ 管理后台

---

## 📄 许可证

本项目采用 [MIT](./LICENSE) 许可证

---

## 👥 作者

- **B22042130黄帅帅** - [GitHub](https://github.com/IndianFatCow/forum_platform#)

---

## 🙏 致谢

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！**

Made with ❤️ by [Your Name]

</div>