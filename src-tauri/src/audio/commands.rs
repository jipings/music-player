use tauri::{command, State};
use std::sync::Mutex;
use crate::audio::player::AudioPlayer;

#[command]
pub fn play(state: State<'_, Mutex<AudioPlayer>>) {
    println!("Play command received");
    let player = state.lock().unwrap();
    player.play();
}

#[command]
pub fn pause(state: State<'_, Mutex<AudioPlayer>>) {
    println!("Pause command received");
    let player = state.lock().unwrap();
    player.pause();
}