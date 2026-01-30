# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

开发流程遵循以下原则：

1. **开发前**：查阅相关文档（PRD 了解需求、UI-UX 了解设计、Tech-Stack 了解规范）
2. **开发中**：遵循 Tech-Stack.md 中的代码规范和目录结构
3. **阶段完成后**：
   - 更新 MILESTONE.md 中的任务状态和变更日志
   - 总结开发要点，检查是否需要更新其他文档
   - 如发现文档与实际实现有差异，及时同步更新

## Git Commit 规范

| 场景 | 何时提交 | 说明 |
|------|----------|------|
| **常规开发** | 完成一个任务即可提交 | 记录进度、方便回滚 |
| **Milestone 完成** | 提交后等待用户测试审核 | 通过后才进入下一阶段 |
| **修 Bug** | 用户验证通过后才提交 | commit 代表交付确认 |

**重要**：修 Bug 时，完成修改后**不要**主动提交 commit，需等待用户验证通过后再提交。

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