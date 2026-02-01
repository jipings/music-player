use crate::audio::player::AudioPlayer;
use std::sync::Mutex;
use tauri::{command, State};

/// # Panics
///
/// Panics if the audio player state mutex is poisoned.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn play(state: State<'_, Mutex<AudioPlayer>>) {
    println!("Play command received");
    let player = state.lock().unwrap();
    player.play();
}

/// # Panics
///
/// Panics if the audio player state mutex is poisoned.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn pause(state: State<'_, Mutex<AudioPlayer>>) {
    println!("Pause command received");
    let player = state.lock().unwrap();
    player.pause();
}
