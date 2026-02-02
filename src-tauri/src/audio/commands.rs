use crate::audio::player::{AudioCommand, AudioPlayerState};
use crate::database::{operations, AppState};
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

/// # Errors
///
/// Returns an error if the database connection lock fails or the operation fails.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn add_folder(
    name: String,
    path: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    operations::add_folder(&conn, &name, &path).map_err(|e| e.to_string())
}

/// # Errors
///
/// Returns an error if the database connection lock fails or the operation fails.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn get_folders(
    name_filter: Option<String>,
    state: State<'_, AppState>,
) -> Result<Vec<operations::LocalFolder>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    operations::get_folders(&conn, name_filter).map_err(|e| e.to_string())
}

/// # Errors
///
/// Returns an error if the database connection lock fails or the operation fails.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn delete_folders(ids: Vec<String>, state: State<'_, AppState>) -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    operations::delete_folders(&conn, &ids).map_err(|e| e.to_string())
}
