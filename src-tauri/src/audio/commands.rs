use crate::audio::player::{AudioCommand, AudioPlayerState};
use crate::database::{operations, AppState};
use crate::scanner::parser::parse_file;
use std::path::Path;
use tauri::{command, AppHandle, Manager, State};
use walkdir::WalkDir;

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
    app_handle: AppHandle,
    name: String,
    path: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let path_obj = Path::new(&path);
    if !path_obj.exists() {
        return Err(format!("Directory does not exist: {path}"));
    }

    let cache_dir = app_handle
        .path()
        .app_cache_dir()
        .map_err(|e| format!("Failed to get app cache dir: {e}"))?;
    let images_dir = cache_dir.join("images");

    let mut tracks = Vec::new();
    let supported_extensions = ["mp3", "flac", "wav", "ogg", "m4a", "aac"];

    for entry in WalkDir::new(&path).into_iter().filter_map(Result::ok) {
        let file_path = entry.path();
        if file_path.is_file() {
            if let Some(extension) = file_path.extension() {
                if let Some(ext_str) = extension.to_str() {
                    if supported_extensions.contains(&ext_str.to_lowercase().as_str()) {
                        match parse_file(file_path.to_str().unwrap_or_default(), Some(&images_dir))
                        {
                            Ok(metadata) => tracks.push(metadata),
                            Err(e) => println!("Error parsing file {file_path:?}: {e}"), // Log error but continue
                        }
                    }
                }
            }
        }
    }

    let song_count = tracks.len() as i32;
    let mut conn = state.db.lock().map_err(|e| e.to_string())?;

    operations::add_tracks(&mut conn, &tracks).map_err(|e| e.to_string())?;
    operations::add_folder(&conn, &name, &path, song_count).map_err(|e| e.to_string())
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
pub fn get_tracks(
    title_filter: Option<String>,
    state: State<'_, AppState>,
) -> Result<Vec<crate::scanner::parser::TrackMetadata>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    operations::get_tracks(&conn, title_filter).map_err(|e| e.to_string())
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

/// # Errors
///
/// Returns an error if the database connection lock fails or the operation fails.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn create_playlist(name: String, state: State<'_, AppState>) -> Result<String, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    operations::create_playlist(&conn, &name).map_err(|e| e.to_string())
}

/// # Errors
///
/// Returns an error if the database connection lock fails or the operation fails.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn get_playlists(state: State<'_, AppState>) -> Result<Vec<operations::Playlist>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    operations::get_playlists(&conn).map_err(|e| e.to_string())
}

/// # Errors
///
/// Returns an error if the database connection lock fails or the operation fails.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn get_tracks_by_playlist(
    playlist_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<crate::scanner::parser::TrackMetadata>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    operations::get_tracks_by_playlist(&conn, &playlist_id).map_err(|e| e.to_string())
}

/// # Errors
///
/// Returns an error if the database connection lock fails or the operation fails.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn add_tracks_to_playlist(
    playlist_id: String,
    track_ids: Vec<i64>,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let mut conn = state.db.lock().map_err(|e| e.to_string())?;
    operations::add_tracks_to_playlist(&mut conn, &playlist_id, &track_ids)
        .map_err(|e| e.to_string())
}

/// # Errors
///
/// Returns an error if the database connection lock fails or the operation fails.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn delete_tracks_from_playlist(
    playlist_id: String,
    track_ids: Vec<i64>,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    operations::delete_tracks_from_playlist(&conn, &playlist_id, &track_ids)
        .map_err(|e| e.to_string())
}

/// # Errors
///
/// Returns an error if the database connection lock fails or the operation fails.
#[command]
#[allow(clippy::needless_pass_by_value)]
pub fn delete_playlist(playlist_id: String, state: State<'_, AppState>) -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    operations::delete_playlist(&conn, &playlist_id).map_err(|e| e.to_string())
}
