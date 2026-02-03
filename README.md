# Music Player

一个基于 Tauri 2 构建的跨平台桌面音乐播放器。

> **注意**: 本项目大部分代码由 [Gemini CLI](https://github.com/google/generative-ai-docs) 和 [Claude Code](https://github.com/anthropics/claude-code) 生成，少数 bug 由手工修复。

## 🚧 项目状态

本项目目前处于开发阶段，可能存在一些 bug 和不完善的功能。欢迎提交 [Issues](../../issues) 和 [Pull Requests](../../pulls)！

## ✨ 功能特性

- 🎵 本地音乐文件播放
- 📁 文件夹扫描和管理
- 🎨 现代化的用户界面
- 💾 SQLite 数据库存储音乐库信息
- 🖼️ 专辑封面显示
- 📋 播放列表管理 TODO

## 🛠️ 技术栈

### 前端
- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS 4** - 样式框架
- **Zustand** - 状态管理
- **Lucide React** - 图标库
- **Jest + Testing Library** - 单元测试

### 后端 (Rust)

本项目使用 Rust 构建高性能的后端服务，主要技术包括：

#### 核心框架
- **[Tauri 2](https://tauri.app/)** - 跨平台桌面应用框架，提供轻量级的 WebView 容器和原生系统 API 访问

#### 音频处理
- **[rodio](https://github.com/RustAudio/rodio)** (v0.21.1) - 音频播放引擎
  - 使用 `symphonia-all` 特性支持多种音频格式（MP3, FLAC, WAV, OGG 等）
  - 提供音频播放控制（播放、暂停、音量调节等）
- **[lofty](https://github.com/Serial-ATA/lofty-rs)** (v0.22.4) - 音频元数据读取
  - 解析音频文件的标签信息（标题、艺术家、专辑等）
  - 提取专辑封面图片

#### 数据存储
- **[rusqlite](https://github.com/rusqlite/rusqlite)** (v0.38.0) - SQLite 数据库绑定
  - 存储音乐库信息、播放列表等数据
  - 提供高效的本地数据持久化

#### 异步运行时
- **[tokio](https://tokio.rs/)** (v1.49.0) - 异步运行时
  - 使用 `full` 特性集，支持完整的异步 I/O 操作
  - 处理文件扫描、数据库操作等异步任务

#### 工具库
- **[walkdir](https://github.com/BurntSushi/walkdir)** (v2) - 递归目录遍历
  - 扫描本地文件夹中的音频文件
- **[uuid](https://github.com/uuid-rs/uuid)** (v1.20.0) - UUID 生成
  - 为音乐、播放列表等实体生成唯一标识符
- **[sha2](https://github.com/RustCrypto/hashes)** (v0.10.9) + **[hex](https://github.com/KokaKiwi/rust-hex)** (v0.4.3) - 哈希计算
  - 生成文件指纹，用于去重和缓存
- **[image](https://github.com/image-rs/image)** (v0.25.9) - 图像处理
  - 处理专辑封面图片的读取和转换
- **[serde](https://serde.rs/)** + **[serde_json](https://github.com/serde-rs/json)** - 序列化/反序列化
  - 前后端数据交互的 JSON 序列化

#### Tauri 插件
- **tauri-plugin-fs** - 文件系统访问
- **tauri-plugin-dialog** - 原生对话框（文件选择器等）
- **tauri-plugin-opener** - 打开外部链接和文件

## 🚀 开发

### 前置要求

- Node.js 18+
- Rust 1.70+
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm tauri dev
```

### 构建

```bash
pnpm tauri build
```

### 运行测试

```bash
pnpm test
```

### 代码格式化

```bash
pnpm format
```

## 📝 开发工具

### 推荐 IDE 配置

- [VS Code](https://code.visualstudio.com/)
- [Tauri Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

### Git Hooks

项目使用 Husky 和 lint-staged 进行代码质量控制：
- 提交前自动格式化代码
- 运行 ESLint 检查
- 格式化 Rust 代码

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
