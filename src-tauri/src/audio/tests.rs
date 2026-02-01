use super::commands;
use super::player::{AudioCommand, AudioPlayerState};
use std::sync::{mpsc, Mutex};
use tauri::State;

// Helper to create a dummy state for testing commands
fn create_test_state() -> (AudioPlayerState, mpsc::Receiver<AudioCommand>) {
    let (tx, rx) = mpsc::channel();
    let state = AudioPlayerState { tx: Mutex::new(tx) };
    (state, rx)
}

#[test]
fn test_play_command() {
    let (state, rx) = create_test_state();
    // Safety: State wrapper for testing. In real Tauri, State manages lifetime.
    // Here we just cast reference to pretend it's State.
    let state_ref =
        unsafe { std::mem::transmute::<&AudioPlayerState, State<'_, AudioPlayerState>>(&state) };

    let path = "/path/to/song.mp3".to_string();
    let result = commands::play(path.clone(), state_ref);

    assert!(result.is_ok());

    match rx.try_recv() {
        Ok(AudioCommand::Play(p)) => assert_eq!(p, path),
        _ => panic!("Expected Play command"),
    }
}

#[test]
fn test_pause_command() {
    let (state, rx) = create_test_state();
    let state_ref =
        unsafe { std::mem::transmute::<&AudioPlayerState, State<'_, AudioPlayerState>>(&state) };

    let result = commands::pause(state_ref);
    assert!(result.is_ok());

    match rx.try_recv() {
        Ok(AudioCommand::Pause) => {}
        _ => panic!("Expected Pause command"),
    }
}

#[test]
fn test_resume_command() {
    let (state, rx) = create_test_state();
    let state_ref =
        unsafe { std::mem::transmute::<&AudioPlayerState, State<'_, AudioPlayerState>>(&state) };

    let result = commands::resume(state_ref);
    assert!(result.is_ok());

    match rx.try_recv() {
        Ok(AudioCommand::Resume) => {}
        _ => panic!("Expected Resume command"),
    }
}

#[test]
fn test_stop_command() {
    let (state, rx) = create_test_state();
    let state_ref =
        unsafe { std::mem::transmute::<&AudioPlayerState, State<'_, AudioPlayerState>>(&state) };

    let result = commands::stop(state_ref);
    assert!(result.is_ok());

    match rx.try_recv() {
        Ok(AudioCommand::Stop) => {}
        _ => panic!("Expected Stop command"),
    }
}

#[test]
fn test_seek_command() {
    let (state, rx) = create_test_state();
    let state_ref =
        unsafe { std::mem::transmute::<&AudioPlayerState, State<'_, AudioPlayerState>>(&state) };

    let result = commands::seek(120.5, state_ref);
    assert!(result.is_ok());

    match rx.try_recv() {
        Ok(AudioCommand::Seek(val)) => assert!((val - 120.5).abs() < f32::EPSILON),
        _ => panic!("Expected Seek command"),
    }
}

#[test]
fn test_set_volume_command() {
    let (state, rx) = create_test_state();
    let state_ref =
        unsafe { std::mem::transmute::<&AudioPlayerState, State<'_, AudioPlayerState>>(&state) };

    let result = commands::set_volume(0.8, state_ref);
    assert!(result.is_ok());

    match rx.try_recv() {
        Ok(AudioCommand::SetVolume(val)) => assert!((val - 0.8).abs() < f32::EPSILON),
        _ => panic!("Expected SetVolume command"),
    }
}

#[test]
fn test_channel_error_handling() {
    // Test that commands return error when channel receiver is dropped
    let (tx, rx) = mpsc::channel();
    let state = AudioPlayerState { tx: Mutex::new(tx) };
    drop(rx); // Drop receiver to cause SendError

    let state_ref =
        unsafe { std::mem::transmute::<&AudioPlayerState, State<'_, AudioPlayerState>>(&state) };

    let result = commands::stop(state_ref);
    assert!(result.is_err());
}
