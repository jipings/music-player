pub mod audio;
pub mod database;
pub mod scanner;

use audio::commands::{pause, play, resume, seek, set_volume, stop};
use audio::player::init_audio_thread;
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
            match database::schema::init_db() {
                Ok(_) => println!("Database initialized"),
                Err(e) => eprintln!("Database init failed: {e}"),
            }

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet, play, pause, resume, stop, seek, set_volume
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
