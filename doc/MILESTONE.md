# Mini IPTV Player - 开发里程碑

## 开发阶段概览

| 阶段 | 名称 | 状态 | 完成日期 |
|------|------|------|----------|
| M0 | 项目初始化 | ✅ 已完成 | 2026-01-29 |
| M1 | 核心播放功能 | 待开始 | - |
| M2 | 频道管理 | 待开始 | - |
| M3 | 收藏与历史 | 待开始 | - |
| M4 | 设置与个性化 | 待开始 | - |
| M5 | 高级功能 | 待开始 | - |
| M6 | 优化与发布 | 待开始 | - |

---

## M0: 项目初始化

**目标**：搭建项目基础架构，配置开发环境

### 任务清单

- [x] 使用 Expo SDK 55 创建项目
- [x] 配置 TypeScript
- [x] 配置 NativeWind + Tailwind CSS
- [x] 配置 Biome (lint + format)
- [x] 初始化 react-native-reusables
- [x] 配置 Expo Router 基础路由结构
- [x] 配置 Zustand + MMKV 持久化
- [x] 配置 i18next 国际化
- [x] 配置 React Query
- [x] 创建基础 UI 组件（从 reusables 添加）

### 交付物

- 可运行的空项目
- 底部 Tab 导航结构
- 明暗模式切换功能

---

## M1: 核心播放功能

**目标**：实现基础的视频播放能力

### 任务清单

- [ ] 集成 react-native-video
- [ ] 实现 VideoPlayer 组件
- [ ] 实现 ControlBar 组件（播放/暂停、音量、全屏）
- [ ] 实现播放器页面布局（16:9 播放器 + 下方频道列表）
- [ ] 处理播放错误状态
- [ ] 实现加载状态 UI

### 交付物

- 可播放 HLS/MP4 流的播放器
- 基础控件功能

---

## M2: 频道管理

**目标**：实现 IPTV 源解析和频道展示

### 任务清单

- [ ] 集成 iptv-playlist-parser
- [ ] 实现 M3U 源解析服务
- [ ] 实现默认源加载（iptv-org/iptv）
- [ ] 实现频道列表组件（ChannelList）
- [ ] 实现频道分组折叠（ChannelGroup）
- [ ] 实现频道卡片（ChannelCard）
- [ ] 实现频道状态检测（懒加载）
- [ ] 实现状态指示器（StatusIndicator）
- [ ] 实现频道搜索
- [ ] 实现排序功能

### 交付物

- 首页频道列表展示
- 分组折叠功能
- 搜索和排序功能
- 频道状态实时检测

---

## M3: 收藏与历史

**目标**：实现用户数据管理

### 任务清单

- [ ] 实现收藏 Store（useFavoriteStore）
- [ ] 实现历史 Store（useHistoryStore）
- [ ] 实现收藏/取消收藏功能
- [ ] 实现收藏页面
- [ ] 实现播放历史记录
- [ ] 实现历史页面
- [ ] 实现空状态 UI

### 交付物

- 收藏 Tab 页面
- 历史 Tab 页面
- 数据本地持久化

---

## M4: 设置与个性化

**目标**：实现应用设置和 IPTV 源管理

### 任务清单

- [ ] 实现设置页面布局
- [ ] 实现 IPTV 源管理页面
- [ ] 实现添加/编辑/删除源功能
- [ ] 实现主题切换（明/暗/跟随系统）
- [ ] 实现语言切换（中/英文）
- [ ] 实现源 Store（useSourceStore）

### 交付物

- 设置 Tab 页面
- IPTV 源增删改查
- 主题和语言设置

---

## M5: 高级功能

**目标**：实现投屏、EPG 等进阶功能

### 任务清单

- [ ] 集成 react-native-google-cast
- [ ] 实现 Chromecast 投屏
- [ ] 实现 AirPlay 支持（iOS 原生）
- [ ] 实现 EPG 数据解析
- [ ] 实现 EPG 卡片展示
- [ ] 实现离线缓存
- [ ] 实现列表/网格布局切换

### 交付物

- 投屏功能
- EPG 节目指南
- 离线浏览能力

---

## M6: 优化与发布

**目标**：性能优化、测试、发布准备

### 任务清单

- [ ] 性能优化（列表虚拟化、图片懒加载）
- [ ] 编写单元测试
- [ ] 编写组件测试
- [ ] 无障碍优化
- [ ] 应用图标和启动屏
- [ ] EAS 构建配置
- [ ] TestFlight / Google Play 内测

### 交付物

- 测试覆盖
- 可发布的应用包

---

## 变更日志

### 2026-01-29

- 创建项目文档：PRD.md、UI-UX-Design.md、Tech-Stack.md
- 确定技术栈：Expo SDK 55、React Native 0.83、NativeWind 4.2
- 确定 UI 方案：react-native-reusables + lucide-react-native
- **完成 M0：项目初始化**
  - 使用 Expo SDK 55 preview 创建项目
  - 配置 NativeWind 4.2 + Tailwind CSS 3.4
  - 配置 Biome 代码检查和格式化
  - 配置 react-native-reusables 组件库
  - 创建底部 Tab 导航（首页、收藏、历史、设置）
  - 配置 Zustand + MMKV 状态持久化
  - 配置 i18next 国际化（中英文）
  - 配置 React Query 数据请求
  - 创建基础 UI 组件（Button, Card, Text）
