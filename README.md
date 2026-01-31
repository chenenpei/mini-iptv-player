# Mini IPTV Player

一款轻量级的跨平台 IPTV 播放器，支持 iOS 和 Android。

A lightweight cross-platform IPTV player for iOS and Android.

## 功能特性 / Features

- 📺 **M3U/M3U8 源支持** - 支持标准 M3U 格式的 IPTV 源
- 🔍 **频道搜索** - 快速搜索频道名称
- 📂 **分组展示** - 按 group-title 自动分组，支持折叠/展开
- ⭐ **收藏频道** - 收藏常看的频道，快速访问
- 📜 **播放历史** - 自动记录观看历史
- 🎬 **分屏播放** - 上方播放器 + 下方频道列表
- 🌓 **明暗主题** - 支持明/暗模式切换
- 🌍 **多语言** - 支持中文和英文

## 截图 / Screenshots

<!-- TODO: 添加应用截图 -->

## 技术栈 / Tech Stack

- **Framework**: React Native 0.83 + Expo SDK 55
- **Routing**: Expo Router
- **Language**: TypeScript
- **State**: Zustand + MMKV
- **Styling**: NativeWind (Tailwind CSS)
- **UI**: react-native-reusables (shadcn/ui for RN)
- **Video**: react-native-video
- **i18n**: i18next

## 开始使用 / Getting Started

### 环境要求 / Prerequisites

- Node.js 18+
- pnpm 8+
- iOS: Xcode 15+ (macOS only)
- Android: Android Studio + JDK 17

### 安装 / Installation

```bash
# 克隆仓库
git clone https://github.com/chenenpei/mini-iptv-player.git
cd mini-iptv-player

# 安装依赖
pnpm install

# 启动开发服务器
pnpm start
```

### 运行 / Running

```bash
# iOS
pnpm ios

# Android
pnpm android
```

## 项目结构 / Project Structure

```
├── app/                    # Expo Router 页面
│   ├── (tabs)/            # 底部 Tab 导航
│   │   ├── index.tsx      # 首页（频道列表）
│   │   ├── favorites.tsx  # 收藏
│   │   ├── history.tsx    # 历史
│   │   └── settings.tsx   # 设置
│   └── player/            # 播放器页面
├── src/
│   ├── components/        # UI 组件
│   │   ├── channel/       # 频道相关组件
│   │   ├── player/        # 播放器组件
│   │   └── ui/            # 通用 UI 组件
│   ├── hooks/             # 自定义 Hooks
│   ├── stores/            # Zustand 状态管理
│   ├── services/          # 业务服务（解析器等）
│   ├── i18n/              # 国际化
│   └── utils/             # 工具函数
└── doc/                   # 项目文档
```

## 开发文档 / Documentation

详细文档位于 `doc/` 目录：

- [PRD.md](doc/PRD.md) - 产品需求文档
- [UI-UX-Design.md](doc/UI-UX-Design.md) - UI/UX 设计规范
- [Tech-Stack.md](doc/Tech-Stack.md) - 技术栈文档
- [MILESTONE.md](doc/MILESTONE.md) - 开发里程碑

## 开发进度 / Roadmap

- [x] M0: 项目初始化
- [x] M1: 频道管理
- [x] M2: 核心播放功能
- [x] M3: 收藏与历史
- [ ] M4: 设置与个性化
- [ ] M5: 高级功能（投屏、EPG）
- [ ] M6: 优化与发布

## 贡献 / Contributing

欢迎提交 Issue 和 Pull Request！

## 许可证 / License

MIT License
