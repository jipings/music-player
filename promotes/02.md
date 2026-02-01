选择 **方案 B（Rust 后端播放）** 是一个追求高性能和系统级控制的决定。这会让你的应用架构更接近专业的本地播放器（如 Foobar2000 或 MusicBee）。

这种架构的核心挑战在于**状态同步**：Rust 是“唯一的真实数据源（Source of Truth）”，而前端只是一个“遥控器”和“显示器”。

以下是为你设计的开发框架和项目目录结构：

### 1. 核心架构模式：Actor 模型 (简化版)

由于 Rust 的音频播放（`rodio`）通常需要在一个独立的线程中运行（避免阻塞 Tauri 的主循环），我们需要采用类似 Actor 的模式：

1. **Frontend (UI)**: 发送指令（Play, Pause, Seek）。
2. **Command Layer (Tauri)**: 接收指令，通过 `mpsc Channel`（消息通道）将指令转发给音频线程。
3. **Audio Thread (Rust)**:
* 持有 `rodio::Sink`（音频输出流）。
* 死循环监听通道消息并执行操作。
* 定时（如每 500ms）通过 `AppHandle` 向前端发射 `playback-progress` 事件。



---

### 2. 推荐的项目目录结构

```text
my-music-player/
├── src/                       # --- 前端代码 (React/Vue + Tailwind) ---
│   ├── assets/
│   ├── components/            # UI 组件
│   │   ├── PlayerBar/         # 底部播放条 (控制按钮, 进度条)
│   │   ├── Library/           # 音乐列表视图
│   │   └── Sidebar/           # 侧边栏导航
│   ├── store/                 # 状态管理 (Zustand/Pinia)
│   │   └── audioStore.ts      # 专门用于同步后端播放状态
│   ├── hooks/                 # 封装 Tauri 的 invoke/listen
│   └── App.tsx
│
├── src-tauri/                 # --- 后端代码 (Rust) ---
│   ├── icons/
│   ├── src/
│   │   ├── audio/             # [核心模块] 音频引擎
│   │   │   ├── mod.rs         # 模块暴露
│   │   │   ├── player.rs      # 封装 rodio，运行音频线程
│   │   │   └── commands.rs    # 供前端调用的 Tauri Commands (play, pause...)
│   │   │   
│   │   ├── database/          # [核心模块] 本地数据库 (SQLite)
│   │   │   ├── mod.rs
│   │   │   ├── schema.rs      # 数据库表结构定义
│   │   │   └── operations.rs  # CRUD 操作 (添加歌曲, 获取列表)
│   │   │   
│   │   ├── scanner/           # [核心模块] 文件扫描
│   │   │   ├── mod.rs
│   │   │   └── parser.rs      # 使用 lofty 解析 metadata (封面, 时长)
│   │   │   
│   │   ├── lib.rs             # 库入口
│   │   └── main.rs            # 程序入口
│   ├── tauri.conf.json
│   └── Cargo.toml
└── package.json

```

---

### 3. Rust 后端关键模块设计

#### A. 音频状态管理 (`audio/player.rs`)

这是整个 APP 的心脏。你需要创建一个全局状态来持有发送命令到音频线程的“发送端”。

```rust
// 伪代码示例
use std::sync::Mutex;
use std::sync::mpsc::Sender;

// 定义发给音频线程的指令枚举
pub enum AudioCommand {
    Play(String), // 播放文件路径
    Pause,
    Resume,
    Stop,
    Seek(f64),    // 跳转到秒数
    SetVolume(f32),
}

// 存放在 Tauri State 中的结构体
pub struct AudioPlayerState {
    // 使用 Mutex 保护发送端，以便在 Tauri Command 中并发调用
    pub tx: Mutex<Sender<AudioCommand>>, 
}

```

#### B. 数据库设计 (`database/schema.rs`)

既然使用方案 B，不要每次启动都遍历文件夹。使用 `rusqlite` 创建一个轻量级数据库。

**建议的表结构：**

* **songs**: `id`, `path` (文件路径), `title`, `artist`, `album`, `duration` (时长), `album_id`.
* **albums**: `id`, `name`, `cover_art_path` (缓存的封面图路径).
* **artists**: `id`, `name`.

#### C. 数据通信 (`audio/commands.rs`)

这是前端调用的接口。

```rust
#[tauri::command]
pub async fn play_track(
    state: tauri::State<'_, AudioPlayerState>,
    file_path: String
) -> Result<(), String> {
    let tx = state.tx.lock().unwrap();
    // 发送指令给后台音频线程，非阻塞
    tx.send(AudioCommand::Play(file_path)).map_err(|e| e.to_string())
}

```

---

### 4. 前端开发策略 (Tailwind + Store)

前端不再负责“计算时间”，而是负责“展示状态”。

#### A. Store 的设计 (以 Zustand 为例)

你的 Store 应该是一个被动的接收者。

```typescript
interface PlayerStore {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTrack: Track | null;
  
  // Actions 只是调用 Rust，不直接修改状态（乐观更新除外）
  play: (path: string) => Promise<void>; 
  pause: () => Promise<void>;
}

```

#### B. 事件监听 (App.tsx)

在应用挂载时，启动对后端事件的监听：

```typescript
import { listen } from '@tauri-apps/api/event';

useEffect(() => {
  // 监听播放进度（Rust 每 500ms 发一次）
  const unlistenProgress = listen('playback-progress', (event) => {
    usePlayerStore.setState({ currentTime: event.payload as number });
  });

  // 监听状态变化（例如歌曲自然播放结束）
  const unlistenStatus = listen('player-status', (event) => {
    // update isPlaying, currentTrack...
  });

  return () => {
    unlistenProgress.then(f => f());
    unlistenStatus.then(f => f());
  };
}, []);

```

---

### 5. 初始开发步骤建议

为了避免一开始就陷入复杂的架构泥潭，建议按此顺序实施：

1. **阶段一：能够出声 (MVP)**
* 在 `main.rs` 启动一个简单的线程运行 `rodio`。
* 实现 `play_file` command。
* 前端放一个按钮，点击 -> 听到声音。
* *目的：验证 Rust 线程模型和 Tauri Command 通路。*


2. **阶段二：元数据与列表**
* 引入 `lofty`。
* 实现“拖拽文件夹”进入窗口。
* 后端扫描文件夹，提取 Artist/Title，返回 JSON 给前端列表。
* *目的：搞定文件 IO 和数据传递。*


3. **阶段三：控制与同步**
* 实现 Pause/Resume/Seek。
* 实现 Rust -> 前端的进度事件（Progress Event）。
* 前端制作进度条，对接事件。


4. **阶段四：数据库与缓存**
* 引入 SQLite。
* 处理封面图缓存（最繁琐的一步）。



你想先看 **Rust 音频线程（Audio Thread）的具体实现代码**，还是 **数据库 Schema 的 SQL 设计**？
