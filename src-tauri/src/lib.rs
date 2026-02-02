pub mod audio;
pub mod database;
pub mod scanner;

use audio::commands::{
    add_folder, add_tracks_to_playlist, create_playlist, delete_folders, delete_playlist,
    delete_tracks_from_playlist, get_folders, get_playlists, get_tracks, get_tracks_by_playlist,
    pause, play, resume, seek, set_volume, stop,
};
use audio::player::init_audio_thread;
use database::AppState;
use std::sync::Mutex;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {name}! You've been greeted from Rust!")
}

/// # Panics
///
/// Panics if the Tauri application fails to run or if audio initialization fails.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Initialize Audio Thread
            // We pass the app handle to the audio thread so it can emit events
            let app_handle = app.handle().clone();
            let player_state = init_audio_thread(app_handle);

            // Manage the state so commands can access it
            app.manage(player_state);

            // Initialize DB
            let conn = match database::schema::init_db() {
                Ok(c) => {
                    println!("Database initialized");
                    c
                }
                Err(e) => panic!("Database init failed: {e}"),
            };

            // Initialize default playlists
            let default_playlists = ["Recent", "Favorites", "Default"];
            for name in default_playlists {
                // Ignore error if already exists (name is UNIQUE)
                let _ = database::operations::create_playlist(&conn, name);
            }

            app.manage(AppState {
                db: Mutex::new(conn),
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            play,
            pause,
            resume,
            stop,
            seek,
            set_volume,
            add_folder,
            get_folders,
            delete_folders,
            get_tracks,
            create_playlist,
            get_playlists,
            get_tracks_by_playlist,
            add_tracks_to_playlist,
            delete_tracks_from_playlist,
            delete_playlist
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
