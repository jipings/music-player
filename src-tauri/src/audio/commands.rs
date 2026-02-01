use crate::audio::player::{AudioCommand, AudioPlayerState};
use tauri::{command, State};

/// # Errors
///
/// Returns an error if the audio command channel is disconnected or the mutex is poisoned.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn play(path: String, state: State<'_, AudioPlayerState>) -> Result<(), String> {
    let tx = state.tx.lock().map_err(|e| e.to_string())?;
    tx.send(AudioCommand::Play(path)).map_err(|e| e.to_string())
}

/// # Errors
///
/// Returns an error if the audio command channel is disconnected or the mutex is poisoned.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn pause(state: State<'_, AudioPlayerState>) -> Result<(), String> {
    let tx = state.tx.lock().map_err(|e| e.to_string())?;
    tx.send(AudioCommand::Pause).map_err(|e| e.to_string())
}

/// # Errors
///
/// Returns an error if the audio command channel is disconnected or the mutex is poisoned.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn resume(state: State<'_, AudioPlayerState>) -> Result<(), String> {
    let tx = state.tx.lock().map_err(|e| e.to_string())?;
    tx.send(AudioCommand::Resume).map_err(|e| e.to_string())
}

/// # Errors
///
/// Returns an error if the audio command channel is disconnected or the mutex is poisoned.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn stop(state: State<'_, AudioPlayerState>) -> Result<(), String> {
    let tx = state.tx.lock().map_err(|e| e.to_string())?;
    tx.send(AudioCommand::Stop).map_err(|e| e.to_string())
}

/// # Errors
///
/// Returns an error if the audio command channel is disconnected or the mutex is poisoned.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn seek(seconds: f32, state: State<'_, AudioPlayerState>) -> Result<(), String> {
    let tx = state.tx.lock().map_err(|e| e.to_string())?;
    tx.send(AudioCommand::Seek(seconds))
        .map_err(|e| e.to_string())
}

/// # Errors
///
/// Returns an error if the audio command channel is disconnected or the mutex is poisoned.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn set_volume(volume: f32, state: State<'_, AudioPlayerState>) -> Result<(), String> {
    let tx = state.tx.lock().map_err(|e| e.to_string())?;
    tx.send(AudioCommand::SetVolume(volume))
        .map_err(|e| e.to_string())
}
