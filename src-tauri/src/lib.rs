pub mod audio;
pub mod database;
pub mod scanner;

use audio::player::AudioPlayer;
use audio::commands::{play, pause};
use std::sync::Mutex;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Initialize AudioPlayer state
            match AudioPlayer::new() {
                Ok(player) => {
                    app.manage(Mutex::new(player));
                }
                Err(e) => {
                    eprintln!("Error initializing AudioPlayer: {}", e);
                    // We might want to exit or continue with limited functionality
                    // For now, we continue, but commands needing player might fail (or we need to check existence)
                    // Better approach: Manage an Option<AudioPlayer> or a dummy
                    // But simpler: just panic here if audio is critical, or log.
                    // Let's panic for now as per previous behavior, but with message.
                    // Or actually, don't panic, just don't manage state?
                    // Commands will fail if state is missing.
                    // Let's manage a dummy or just return error setup?
                    return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, e)));
                }
            }
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, play, pause])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}