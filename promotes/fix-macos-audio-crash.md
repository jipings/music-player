# macOS 音频播放崩溃修复方案

## 问题描述

打包后的应用在 macOS 上启动时崩溃，错误日志显示：
- 崩溃发生在 `tao::platform_impl::platform::app_delegate::did_finish_launching`
- Exception Type: `EXC_CRASH (SIGABRT)`
- 崩溃线程尝试调用 `rodio::stream::OutputStreamBuilder::open_default_stream`

## 根本原因

1. 应用在 `setup` 阶段调用 `init_audio_thread()` 初始化音频线程
2. 音频线程立即尝试初始化 CoreAudio 输出流
3. 在 macOS 应用启动早期（`did_finish_launching` 期间），CoreAudio 可能还未完全准备好
4. 缺少必要的 macOS entitlements 配置

## 解决方案

### 1. 添加 macOS Entitlements 配置

创建 `src-tauri/entitlements.plist`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Allow audio output -->
    <key>com.apple.security.device.audio-input</key>
    <false/>

    <!-- Disable App Sandbox for audio device access -->
    <key>com.apple.security.app-sandbox</key>
    <false/>

    <!-- Allow file access for reading music files -->
    <key>com.apple.security.files.user-selected.read-only</key>
    <true/>
</dict>
</plist>
```

更新 `src-tauri/tauri.conf.json`：

```json
{
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [...],
    "macOS": {
      "entitlements": "entitlements.plist",
      "minimumSystemVersion": "10.13"
    }
  }
}
```

### 2. 实现延迟初始化（Lazy Initialization）

修改 `src-tauri/src/audio/player.rs` 中的 `init_audio_thread` 函数：

**修改前：**
```rust
thread::spawn(move || {
    let stream_result = OutputStreamBuilder::open_default_stream();
    if let Err(e) = stream_result {
        eprintln!("Audio thread failed to open output stream: {e}");
        return;
    }
    let stream = stream_result.unwrap();
    let sink = Sink::connect_new(stream.mixer());
    // ...
});
```

**修改后：**
```rust
thread::spawn(move || {
    // Lazy initialization: only create stream when needed
    let mut stream = None;
    let mut sink = None;
    let mut current_duration = Duration::from_secs(0);

    loop {
        match rx.recv_timeout(Duration::from_millis(200)) {
            Ok(cmd) => match cmd {
                AudioCommand::Play(path) => {
                    // Initialize stream and sink on first use
                    if stream.is_none() {
                        match OutputStreamBuilder::open_default_stream() {
                            Ok(s) => {
                                let new_sink = Sink::connect_new(s.mixer());
                                stream = Some(s);
                                sink = Some(new_sink);
                            }
                            Err(e) => {
                                eprintln!("Audio thread failed to open output stream: {e}");
                                app_handle
                                    .emit("player-error", format!("Failed to initialize audio: {e}"))
                                    .ok();
                                continue;
                            }
                        }
                    }

                    let sink_ref = sink.as_ref().unwrap();
                    // ... 播放逻辑
                }
                AudioCommand::Pause => {
                    if let Some(s) = &sink {
                        s.pause();
                        // ...
                    }
                }
                // 其他命令也需要检查 sink 是否存在
            }
        }
    }
});
```

### 3. 更新所有音频命令处理

所有使用 `sink` 的地方都需要检查其是否已初始化：

```rust
AudioCommand::Pause => {
    if let Some(s) = &sink {
        s.pause();
        // ...
    }
}

AudioCommand::Resume => {
    if let Some(s) = &sink {
        s.play();
        // ...
    }
}

AudioCommand::Stop => {
    if let Some(s) = &sink {
        s.stop();
        s.clear();
        // ...
    }
}

AudioCommand::Seek(secs) => {
    if let Some(s) = &sink {
        if let Err(e) = s.try_seek(Duration::from_secs_f32(secs)) {
            eprintln!("Seek failed: {e}");
        }
    }
}

AudioCommand::SetVolume(vol) => {
    if let Some(s) = &sink {
        s.set_volume(vol);
    }
}
```

周期性进度更新也需要检查：

```rust
Err(mpsc::RecvTimeoutError::Timeout) => {
    if let Some(s) = &sink {
        if !s.empty() && !s.is_paused() {
            let pos = s.get_pos().as_secs_f64();
            app_handle
                .emit("player-progress", serde_json::json!({
                    "position": pos,
                    "duration": current_duration.as_secs_f64()
                }))
                .ok();
        }
    }
}
```

## 技术原理

### 为什么延迟初始化有效？

1. **避免启动时竞态条件**：应用启动时，macOS 的事件循环和 CoreAudio 系统可能还未完全初始化
2. **用户触发时机**：当用户点击播放按钮时，应用已完全启动，所有系统服务都已就绪
3. **优雅降级**：如果音频初始化失败，只影响播放功能，不会导致整个应用崩溃

### macOS Entitlements 说明

- `com.apple.security.app-sandbox: false` - 禁用沙箱以访问音频设备
- `com.apple.security.files.user-selected.read-only: true` - 允许读取用户选择的音频文件
- 音频**输出**不需要麦克风权限（`audio-input` 设为 false）

## 测试步骤

1. 应用修改后重新打包：
   ```bash
   pnpm tauri build
   ```

2. 运行打包后的应用，验证：
   - 应用能正常启动，不崩溃
   - 点击播放按钮时音频正常播放
   - 暂停、恢复、停止、音量调节等功能正常

## 相关文件

- `src-tauri/src/audio/player.rs` - 音频播放器实现
- `src-tauri/src/lib.rs` - 应用初始化逻辑
- `src-tauri/tauri.conf.json` - Tauri 配置
- `src-tauri/entitlements.plist` - macOS 权限配置

## 注意事项

1. 此方案适用于 Tauri + Rodio 的音频播放场景
2. 如果需要在应用启动时预加载音频，可以考虑延迟几秒后再初始化
3. 对于需要 App Sandbox 的应用，需要使用更细粒度的 entitlements 配置
