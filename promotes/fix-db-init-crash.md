# Fix: Database Initialization Crash on macOS

## Problem

The application crashed immediately after launch on macOS with `EXC_CRASH (SIGABRT)` error. The crash occurred during the `did_finish_launching` phase of application startup.

### Error Details

- **Crash Type**: `EXC_CRASH (SIGABRT)`
- **Crash Location**: `tao::platform_impl::platform::app_delegate::did_finish_launching`
- **Root Cause**: `panic_cannot_unwind` - A Rust panic occurred in a context that cannot unwind (Objective-C callback)

### Root Cause Analysis

The crash was caused by database initialization failure during application startup:

1. **Incorrect Database Path**: The code used a relative path `"music_player.db"` to create the database
2. **Write Permission Issue**: In packaged macOS applications, the working directory is typically inside the application bundle, which is **read-only**
3. **Panic on Failure**: When database creation failed, the code called `panic!("Database init failed: {e}")` in `lib.rs:42`
4. **Unwind Context**: The panic occurred in the Tauri setup function, which is called from Objective-C code during `did_finish_launching`, causing an abort

## Solution

### 1. Modified Database Initialization Function

**File**: `src-tauri/src/database/schema.rs`

Changed the `init_db()` function to accept a path parameter:

```rust
// Before
pub fn init_db() -> Result<Connection, rusqlite::Error> {
    let conn = Connection::open("music_player.db")?;
    // ...
}

// After
use std::path::Path;

pub fn init_db<P: AsRef<Path>>(db_path: P) -> Result<Connection, rusqlite::Error> {
    let conn = Connection::open(db_path)?;
    // ...
}
```

### 2. Use Proper Application Data Directory

**File**: `src-tauri/src/lib.rs`

Updated the setup function to use Tauri's `app_data_dir()` API:

```rust
// Before
let conn = match database::schema::init_db() {
    Ok(c) => {
        println!("Database initialized");
        c
    }
    Err(e) => panic!("Database init failed: {e}"),
};

// After
// Get the proper app data directory
let app_data_dir = app.path().app_data_dir()
    .map_err(|e| format!("Failed to get app data directory: {e}"))?;

// Create the directory if it doesn't exist
std::fs::create_dir_all(&app_data_dir)
    .map_err(|e| format!("Failed to create app data directory: {e}"))?;

// Use the correct path for database
let db_path = app_data_dir.join("music_player.db");
println!("Database path: {}", db_path.display());

let conn = database::schema::init_db(&db_path)
    .map_err(|e| format!("Database init failed: {e}"))?;

println!("Database initialized successfully");
```

### 3. Improved Error Handling

Key improvements:
- **Removed `panic!`**: Changed from panic to returning errors using `map_err`
- **Graceful Failure**: Let Tauri's setup function handle errors properly
- **Better Logging**: Added detailed log messages for debugging
- **Directory Creation**: Automatically create app data directory if it doesn't exist

## Database Location

After the fix, the database is created in the proper location:

- **macOS**: `~/Library/Application Support/com.liu.music-player/music_player.db`
- **Windows**: `%APPDATA%\com.liu.music-player\music_player.db`
- **Linux**: `~/.local/share/com.liu.music-player/music_player.db`

## Testing

Build and test the application:

```bash
cd /Users/liu/Documents/GitHub/music-player
pnpm tauri build
```

Run the packaged application:

```bash
open src-tauri/target/release/bundle/macos/music-player.app
```

The application should now start successfully without crashing.

## Related Issues

This fix is separate from the previous audio crash fix (commit 3b24587). That fix addressed CoreAudio initialization during startup, while this fix addresses database initialization.

## Commit Information

- **Date**: 2026-02-03
- **Files Modified**:
  - `src-tauri/src/database/schema.rs`
  - `src-tauri/src/lib.rs`
