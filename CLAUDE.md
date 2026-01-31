# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Rules

### MUST DO
- 开发前查阅 `doc/` 目录下的相关文档
- 完成任务后更新 `doc/MILESTONE.md`
- 常规开发：完成一个任务即提交一个 commit
- 使用已有的 skills 处理任务（见 Claude Code 工作方式）
- 拆分任务并使用 sub-agents 并发处理

### MUST NOT
- **修 Bug 后不要主动提交 commit** - 等用户验证通过后再提交
- 不要一次性提交大量改动 - 按任务拆分 commit
- 不要跳过文档查阅直接开发

## Project Overview

mini-iptv-player - 一个轻量级的跨平台 IPTV 播放器应用，支持 iOS 和 Android。

## Documentation

项目文档位于 `doc/` 目录：

| 文档 | 说明 | 用途 |
|------|------|------|
| [PRD.md](doc/PRD.md) | 产品需求文档 | 功能需求、用户故事、页面状态定义 |
| [UI-UX-Design.md](doc/UI-UX-Design.md) | UI/UX 设计文档 | 视觉规范、组件设计、页面布局、5 种页面状态 |
| [Tech-Stack.md](doc/Tech-Stack.md) | 技术栈文档 | 依赖版本、目录结构、代码规范 |
| [MILESTONE.md](doc/MILESTONE.md) | 开发里程碑 | 开发进度、任务清单、变更日志 |

## Development Workflow

1. **开发前**：查阅 PRD、UI-UX、Tech-Stack 文档
2. **开发中**：遵循 Tech-Stack.md 代码规范
3. **完成后**：更新 MILESTONE.md，同步文档差异

## Claude Code 工作方式

### Skill 优先

规划和执行任务时，优先检查并使用已有的 skills：
- `vercel-react-native-skills` - React Native/Expo 最佳实践
- `ui-ux-pro-max` - UI/UX 设计规范、配色、字体
- `expo-app-design:*` - Expo 原生 UI、数据获取等
- `feature-dev:feature-dev` - 引导式功能开发

### 任务并发

拆分独立任务，使用 sub-agents 并发处理：
- 将复杂任务分解为可并行的子任务
- 无依赖关系的任务同时启动多个 agents
- 有依赖关系的任务按顺序执行

## Git Commit 规范

- 常规开发：一个任务一个 commit
- Milestone 完成：提交后等待用户测试审核
- 修 Bug：**用户验证通过后**才提交（见 Critical Rules）

## Tech Stack

- **Framework**: React Native 0.83 + Expo SDK 55
- **Routing**: Expo Router
- **Language**: TypeScript
- **State**: Zustand + MMKV
- **Styling**: NativeWind (Tailwind CSS)
- **UI Components**: react-native-reusables (shadcn/ui for RN)
- **Icons**: lucide-react-native
- **Animation**: Reanimated + Gesture Handler
- **Video**: react-native-video
- **i18n**: i18next

## Development

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm start

# iOS 开发
pnpm ios

# Android 开发
pnpm android

# 代码检查与格式化
pnpm lint
pnpm format

# 运行测试
pnpm test
```

## Architecture

详见 [Tech-Stack.md](doc/Tech-Stack.md) 中的项目架构章节。

## Development Notes

### Expo SDK 55

- 目前使用 preview 版本 (`55.0.0-preview.7`)，expo-router 使用 canary 版本
- 部分 peer dependency 警告是正常的，SDK 55 正式版发布后会解决
- New Architecture 默认启用且不可禁用

### react-native-mmkv v4

API 已从 v3 变化：

```typescript
// v3 (旧)
import { MMKV } from "react-native-mmkv";
const storage = new MMKV();
storage.delete(key);

// v4 (新)
import { createMMKV } from "react-native-mmkv";
const storage = createMMKV({ id: "app-storage" });
storage.remove(key);
```

### react-native-reusables

- CLI 的 `init` 命令是交互式的，已存在项目需手动配置
- 组件复制到 `src/components/ui/` 目录
- 使用 `npx @react-native-reusables/cli@latest add <component>` 添加组件

### Android 开发环境

Expo SDK 55 preview 自动生成的 `android/` 目录使用 Gradle 9.0.0，但 AGP 要求 Gradle 8.13。如果构建失败，需手动修改：

```properties
# android/gradle/wrapper/gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.13-bin.zip
```

### pnpm Hoisting 问题

pnpm 可能不会将 `react-native-css-interop` 提升到顶层 `node_modules`，导致 Metro 无法解析模块。如遇到以下错误：

```
Unable to resolve "react-native-css-interop/jsx-runtime"
```

需显式安装：

```bash
pnpm add react-native-css-interop
```

### HTTP 明文流量配置

IPTV 源大多使用 HTTP 协议，需要配置允许明文流量：

**Android** (`android/app/src/main/AndroidManifest.xml`)：
```xml
<application
  android:usesCleartextTraffic="true"
  ...>
```

**iOS** (`ios/MiniIPTVPlayer/Info.plist`)：
```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

> **注意**：修改原生配置后需要重新构建 app（`pnpm android` 或 `pnpm ios`）。

### 无障碍开发规范

所有 Pressable 组件必须包含无障碍属性：
- `accessibilityLabel`: 描述元素作用
- `accessibilityRole`: 声明元素角色
- `accessibilityState`: 反馈当前状态（如 selected、expanded）

触摸目标最小 44x44px，使用 `min-h-11 min-w-11` 类名确保符合规范。

详见 [UI-UX-Design.md](doc/UI-UX-Design.md) 8.4 节无障碍实现指南。

### 性能优化快速参考

**图片组件**：优先使用 `expo-image` 替代 React Native Image，支持更好的缓存和过渡效果。

**性能检查清单**：
- 列表项组件使用 `memo()` 包裹
- 回调函数使用 `useCallback`，依赖数组正确
- 动态样式对象使用 `useMemo`
- 只动画 `transform` 和 `opacity` 属性
- 详细指南见 [Tech-Stack.md](doc/Tech-Stack.md) 第 8 节

## Known Issues

### 频道状态自动检测已禁用（性能问题）

**文件**: `src/hooks/useChannelStatus.ts`

**问题**: 自动检测频道状态会严重阻塞 UI，导致：
- 列表点击响应延迟
- 播放器控件不灵敏
- 整体交互卡顿

**原因分析**:
- 即使使用 HEAD 请求 + Range header，网络请求回调仍会阻塞 JS 主线程
- 并发请求 + 频繁状态更新导致 React 重渲染

**当前状态**: 已在 `useChannelStatusCheck` 中禁用自动检测

**待解决方案**:
- [ ] 使用原生模块在后台线程执行网络请求
- [ ] 改为用户手动触发检测（如长按频道）
- [ ] 仅在播放时检测当前频道状态
- [ ] 使用 Web Worker（需要额外配置）