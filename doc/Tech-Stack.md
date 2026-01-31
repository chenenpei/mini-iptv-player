# Mini IPTV Player - 技术栈文档

## 1. 技术选型总览

| 类别 | 技术选择 | 说明 |
|------|----------|------|
| 框架 | React Native + Expo | 跨平台移动开发 |
| 路由 | Expo Router | 文件系统路由 |
| 语言 | TypeScript | 类型安全 |
| 状态管理 | Zustand | 轻量级状态管理 |
| 持久化 | MMKV | 高性能本地存储 |
| 网络请求 | React Query + fetch | 数据获取与缓存 |
| UI 样式 | NativeWind | Tailwind CSS for RN |
| UI 组件 | react-native-reusables | shadcn/ui 风格，copy-paste 方式集成 |
| 图标 | lucide-react-native | 简洁线性图标，与 shadcn/ui 风格一致 |
| 动画 | Reanimated | 高性能动画，已被 reusables/NativeWind 依赖 |
| 手势 | Gesture Handler | 手势交互，配合 Reanimated 使用 |
| 视频播放 | react-native-video | HLS/MP4 播放 |
| 投屏 | react-native-google-cast | Chromecast 支持 |
| 国际化 | i18next + react-i18next | 多语言支持 |
| 代码质量 | Biome | Lint + Format |
| 测试 | Jest + React Native Testing Library | 单元测试 |

## 2. 项目架构

### 2.1 目录结构

```
mini-iptv-player/
├── app/                          # Expo Router 页面
│   ├── (tabs)/                   # Tab 导航组
│   │   ├── index.tsx             # 首页（频道列表）
│   │   ├── favorites.tsx         # 收藏页
│   │   ├── history.tsx           # 历史页
│   │   └── settings.tsx          # 设置页
│   ├── player/
│   │   └── [channelId].tsx       # 播放器页面
│   ├── settings/
│   │   ├── sources/
│   │   │   ├── index.tsx         # IPTV 源列表
│   │   │   ├── add.tsx           # 添加源
│   │   │   └── [sourceId].tsx    # 编辑源
│   │   ├── epg.tsx               # EPG 设置
│   │   ├── language.tsx          # 语言设置
│   │   └── theme.tsx             # 主题设置
│   ├── _layout.tsx               # 根布局
│   └── +not-found.tsx            # 404 页面
│
├── src/
│   ├── components/               # 可复用组件
│   │   ├── ui/                   # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Loading.tsx
│   │   ├── channel/              # 频道相关组件
│   │   │   ├── ChannelList.tsx
│   │   │   ├── ChannelCard.tsx
│   │   │   ├── ChannelGroup.tsx
│   │   │   └── StatusIndicator.tsx
│   │   ├── player/               # 播放器相关组件
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── ControlBar.tsx
│   │   │   └── CastButton.tsx
│   │   └── epg/                  # EPG 相关组件
│   │       └── EpgCard.tsx
│   │
│   ├── stores/                   # Zustand 状态仓库
│   │   ├── useSourceStore.ts     # IPTV 源管理
│   │   ├── useChannelStore.ts    # 频道数据
│   │   ├── useFavoriteStore.ts   # 收藏管理
│   │   ├── useHistoryStore.ts    # 播放历史
│   │   └── useSettingStore.ts    # 应用设置
│   │
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── useChannelStatus.ts   # 频道状态检测
│   │   ├── usePlaylist.ts        # 播放列表解析
│   │   └── useTheme.ts           # 主题管理
│   │
│   ├── services/                 # 服务层
│   │   ├── api.ts                # API 请求
│   │   ├── parser.ts             # M3U 解析
│   │   └── storage.ts            # 持久化封装
│   │
│   ├── utils/                    # 工具函数
│   │   ├── format.ts             # 格式化函数
│   │   └── constants.ts          # 常量定义
│   │
│   ├── i18n/                     # 国际化资源
│   │   ├── index.ts              # i18n 配置
│   │   ├── locales/
│   │   │   ├── zh.json           # 中文
│   │   │   └── en.json           # 英文
│   │
│   └── types/                    # TypeScript 类型
│       ├── channel.ts
│       ├── source.ts
│       └── epg.ts
│
├── assets/                       # 静态资源
│   ├── images/
│   └── icons/
│
├── doc/                          # 项目文档
│   ├── PRD.md
│   ├── UI-UX-Design.md
│   └── Tech-Stack.md
│
├── __tests__/                    # 测试文件
│
├── app.json                      # Expo 配置
├── babel.config.js
├── biome.json                    # Biome 配置
├── tailwind.config.js            # Tailwind 配置
├── tsconfig.json
├── package.json
└── CLAUDE.md
```

### 2.2 模块划分

```
┌─────────────────────────────────────────────────────────┐
│                     展示层 (app/)                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │  首页   │ │  收藏   │ │  历史   │ │  设置   │       │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘       │
└───────┼───────────┼───────────┼───────────┼─────────────┘
        │           │           │           │
┌───────┴───────────┴───────────┴───────────┴─────────────┐
│                   组件层 (src/components/)               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │ 频道组件     │ │ 播放器组件   │ │ UI 基础组件   │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────┐
│                   状态层 (src/stores/)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Source   │ │ Channel  │ │ Favorite │ │ History  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────┐
│                   服务层 (src/services/)                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │ API 请求     │ │ M3U 解析     │ │ 本地存储     │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 3. 核心依赖

### 3.1 运行时依赖

```json
{
  "dependencies": {
    "expo": "55.0.0-preview.7",
    "expo-router": "55.0.0-canary-*",
    "react": "19.2.0",
    "react-native": "0.83.1",

    "zustand": "^5.0.10",
    "react-native-mmkv": "^4.1.2",
    "@tanstack/react-query": "^5.90.0",

    "nativewind": "^4.2.1",
    "tailwindcss": "~3.4.19",

    "react-native-reanimated": "~4.2.1",
    "react-native-gesture-handler": "^2.22.0",

    "lucide-react-native": "^0.563.0",
    "react-native-svg": "^15.15.0",

    "react-native-video": "^6.10.0",
    "react-native-google-cast": "^4.8.0",

    "i18next": "^25.8.0",
    "react-i18next": "^16.5.0"
  }
}

> **注意**：M3U 解析器采用手动实现（`src/services/m3uParser.ts`），不依赖第三方库，以获得更好的控制和更小的包体积。
```

> **注意**：Expo SDK 55 目前处于 preview 阶段，expo-router 使用 canary 版本。预计 2026 年 2 月初发布稳定版。
>
> **react-native-mmkv v4 API 变化**：
> - 创建实例使用 `createMMKV()` 而非 `new MMKV()`
> - 删除方法使用 `remove()` 而非 `delete()`

### 3.2 开发依赖

```json
{
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "typescript": "^5.7.0",

    "jest": "^29.7.0",
    "@testing-library/react-native": "^13.0.0",
    "jest-expo": "~55.0.0"
  }
}
```

## 4. UI 组件策略

### 4.1 策略说明

项目采用 **[react-native-reusables](https://reactnativereusables.com/)** 方案，这是 shadcn/ui 的 React Native 版本。

**选择理由**：
- 与 NativeWind v4 深度集成，无样式冲突
- shadcn/ui 的 copy-paste 理念，代码完全可控
- 内置无障碍支持（基于 rn-primitives）
- 覆盖 36+ 常用组件，开箱即用
- 设计风格简洁，符合极简主义

### 4.2 组件使用方式

react-native-reusables 采用 CLI 方式添加组件到项目中：

```bash
# 初始化项目（首次）
npx @react-native-reusables/cli@latest init

# 添加单个组件
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add input
npx @react-native-reusables/cli@latest add toast

# 添加多个组件
npx @react-native-reusables/cli@latest add button input card dialog
```

组件会被复制到 `src/components/ui/` 目录，可以自由修改。

### 4.3 需要的基础组件

从 react-native-reusables 添加：

| 组件 | 命令 | 用途 |
|------|------|------|
| Button | `add button` | 主要/次要按钮 |
| Input | `add input` | 文本输入框、搜索框 |
| Card | `add card` | 卡片容器 |
| Switch | `add switch` | 开关组件 |
| Skeleton | `add skeleton` | 骨架屏 |
| Toast | `add toast` | 轻提示 |
| Dialog | `add dialog` | 对话框 |
| Collapsible | `add collapsible` | 可折叠区域（频道分组） |
| Tabs | `add tabs` | 底部 Tab 导航辅助 |

### 4.4 自定义业务组件

基于 reusables 基础组件，自行实现业务组件：

| 组件 | 目录 | 说明 |
|------|------|------|
| ChannelList | `src/components/channel/` | 频道列表（列表/网格布局） |
| ChannelCard | `src/components/channel/` | 频道卡片 |
| ChannelGroup | `src/components/channel/` | 频道分组（基于 Collapsible） |
| StatusIndicator | `src/components/channel/` | 频道状态指示点 |
| VideoPlayer | `src/components/player/` | 视频播放器封装 |
| ControlBar | `src/components/player/` | 播放器控件栏 |
| CastButton | `src/components/player/` | 投屏按钮 |
| EpgCard | `src/components/epg/` | EPG 节目卡片 |
| EmptyState | `src/components/ui/` | 空状态占位 |
| ErrorState | `src/components/ui/` | 错误状态占位 |

### 4.5 图标库

使用 **lucide-react-native**，与 shadcn/ui 风格一致：

```bash
pnpm add lucide-react-native react-native-svg
```

```tsx
import { Play, Pause, Volume2, Maximize, Cast, Star, Clock, Settings } from 'lucide-react-native'

// 使用示例
<Play size={24} color="#ffffff" />
```

### 4.6 相关依赖

react-native-reusables 会自动安装以下依赖：

```json
{
  "dependencies": {
    "@rn-primitives/portal": "~1.x.x",
    "@rn-primitives/slot": "~1.x.x",
    "@rn-primitives/types": "~1.x.x",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x.x",
    "tailwind-merge": "^2.x.x",
    "lucide-react-native": "^0.x.x",
    "react-native-svg": "^15.x.x"
  }
}
```

| 库 | 用途 |
|---|------|
| @rn-primitives/* | 无障碍原语组件（类似 Radix UI） |
| class-variance-authority | 管理组件变体样式 |
| clsx | 条件合并 className |
| tailwind-merge | 合并 Tailwind 类名 |
| lucide-react-native | 图标库 |
| react-native-svg | SVG 支持（图标依赖） |

## 5. 开发环境配置

### 5.1 环境要求

| 工具 | 版本要求 |
|------|----------|
| Node.js | >= 20.x LTS |
| pnpm | >= 9.x (推荐) |
| Xcode | >= 15.0 (iOS 开发) |
| Android Studio | >= Hedgehog (Android 开发) |

### 5.2 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm start

# iOS 开发
pnpm ios

# Android 开发
pnpm android

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 运行测试
pnpm test
```

### 5.3 Android SDK 配置

在 `~/.zshrc`（或 `~/.bashrc`）中添加以下环境变量：

```bash
# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Java (Android Studio bundled JDK)
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH=$PATH:$JAVA_HOME/bin
```

配置后执行 `source ~/.zshrc` 使其生效。

### 5.4 环境变量

本项目为纯本地应用，不需要额外的环境变量配置。

## 6. 构建与发布

### 6.1 Expo 构建配置

```json
// app.json
{
  "expo": {
    "name": "Mini IPTV Player",
    "slug": "mini-iptv-player",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "ios": {
      "bundleIdentifier": "com.example.miniiptvplayer",
      "supportsTablet": true,
      "infoPlist": {
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        }
      }
    },
    "android": {
      "package": "com.example.miniiptvplayer",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0a0a0a"
      }
    },
    "plugins": [
      "expo-router",
      "react-native-video",
      "react-native-google-cast"
    ]
  }
}
```

> **SDK 55 注意**：New Architecture 默认启用且不可禁用，`newArchEnabled` 配置项已移除。

### 6.2 HTTP 明文流量配置

IPTV 源大多使用 HTTP 协议，需在原生层配置允许明文流量：

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

### 6.3 构建命令

```bash
# 开发构建 (Development Client)
eas build --profile development --platform ios
eas build --profile development --platform android

# 预览构建
eas build --profile preview --platform all

# 生产构建
eas build --profile production --platform all
```

### 6.4 EAS 配置

```json
// eas.json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## 7. 代码规范

### 7.1 Biome 配置

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noNonNullAssertion": "off"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "es5"
    }
  },
  "files": {
    "ignore": ["node_modules", ".expo", "ios", "android", "dist", "build", "*.d.ts"]
  }
}
```

### 7.2 TypeScript 配置

```json
// tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@stores/*": ["src/stores/*"],
      "@hooks/*": ["src/hooks/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@i18n/*": ["src/i18n/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

### 7.3 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `ChannelList.tsx` |
| 组件名 | PascalCase | `ChannelList` |
| Hook 文件 | camelCase | `useChannelStatus.ts` |
| Hook 名 | camelCase, use 前缀 | `useChannelStatus` |
| Store 文件 | camelCase | `useSourceStore.ts` |
| 工具函数 | camelCase | `formatTime.ts` |
| 常量 | UPPER_SNAKE_CASE | `DEFAULT_SOURCE_URL` |
| 类型/接口 | PascalCase | `Channel`, `ISource` |

### 7.4 组件结构规范

```tsx
// 组件文件结构示例
import { View, Text } from 'react-native'
import { useCallback, useMemo } from 'react'

// 类型定义
interface ChannelCardProps {
  channel: Channel
  onPress: (channel: Channel) => void
}

// 组件实现
export function ChannelCard({ channel, onPress }: ChannelCardProps) {
  // Hooks
  const handlePress = useCallback(() => {
    onPress(channel)
  }, [channel, onPress])

  // 渲染
  return (
    <View>
      <Text>{channel.name}</Text>
    </View>
  )
}
```

## 8. 测试策略

### 8.1 测试金字塔

```
        /\
       /  \       E2E 测试 (少量)
      /────\
     /      \     集成测试 (适量)
    /────────\
   /          \   单元测试 (大量)
  /────────────\
```

### 8.2 测试类型

| 类型 | 工具 | 覆盖范围 |
|------|------|----------|
| 单元测试 | Jest | 工具函数、Hooks、Store |
| 组件测试 | React Native Testing Library | UI 组件 |
| 集成测试 | Jest + RNTL | 页面交互 |

### 8.3 Jest 配置

```js
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
```

### 7.4 测试示例

```tsx
// __tests__/components/StatusIndicator.test.tsx
import { render } from '@testing-library/react-native'
import { StatusIndicator } from '@/components/channel/StatusIndicator'

describe('StatusIndicator', () => {
  it('renders green dot for available status', () => {
    const { getByTestId } = render(<StatusIndicator status="available" />)
    const dot = getByTestId('status-dot')
    expect(dot).toHaveStyle({ backgroundColor: '#22c55e' })
  })

  it('renders red dot for unavailable status', () => {
    const { getByTestId } = render(<StatusIndicator status="unavailable" />)
    const dot = getByTestId('status-dot')
    expect(dot).toHaveStyle({ backgroundColor: '#ef4444' })
  })

  it('renders gray dot for unknown status', () => {
    const { getByTestId } = render(<StatusIndicator status="unknown" />)
    const dot = getByTestId('status-dot')
    expect(dot).toHaveStyle({ backgroundColor: '#6b7280' })
  })
})
```

## 8. 性能优化指南

### 8.1 图片组件选择

**推荐使用 expo-image 替代 React Native Image：**

```tsx
// ❌ 避免
import { Image } from "react-native";

// ✅ 推荐
import { Image } from "expo-image";

<Image
  source={{ uri: imageUrl }}
  contentFit="contain"
  transition={150}
  cachePolicy="memory-disk"
/>
```

**expo-image 优势：**
- 内置内存和磁盘缓存
- 支持 blurhash 占位符
- 更高效的原生实现
- 统一的跨平台 API

### 8.2 组件 Memoization 指南

**列表项组件必须使用 memo 包裹：**

```tsx
// ✅ 正确
export const ListItem = memo(function ListItem({ item, onPress }: Props) {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  return <Pressable onPress={handlePress}>...</Pressable>;
});
```

**常见错误：**

```tsx
// ❌ 内联函数导致 memo 失效
<Pressable onPress={() => onPress(item)}>

// ❌ 内联样式对象导致重渲染
<View style={{ width: 100 }}>

// ✅ 使用 useCallback
const handlePress = useCallback(() => onPress(item), [onPress, item]);

// ✅ 使用 useMemo 或 StyleSheet
const style = useMemo(() => ({ width }), [width]);
```

### 8.3 动画性能最佳实践

**只动画 transform 和 opacity：**

```tsx
// ✅ GPU 加速属性
useAnimatedStyle(() => ({
  transform: [{ translateX: x.value }, { scale: scale.value }],
  opacity: opacity.value,
}));

// ❌ 避免动画这些属性（触发布局重计算）
// width, height, margin, padding, top, left, right, bottom
```

### 8.4 列表性能检查清单

开发列表组件时，确保：

- [ ] 列表项使用 `memo()` 包裹
- [ ] `renderItem` 使用 `useCallback`
- [ ] `keyExtractor` 使用 `useCallback`
- [ ] 无内联函数作为 props
- [ ] 无内联样式对象（除非静态）
- [ ] 配置 `removeClippedSubviews={true}`
- [ ] 配置合理的 `windowSize` 和 `maxToRenderPerBatch`
- [ ] 图片使用 `expo-image` 并配置缓存
