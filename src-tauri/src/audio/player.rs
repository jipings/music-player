use rodio::{Decoder, OutputStreamBuilder, Sink, Source};
use std::fs::File;
use std::io::BufReader;
use std::sync::{mpsc, Mutex};
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Emitter};

#[derive(Debug)]
pub enum AudioCommand {
    Play(String),   // Play new file
    Pause,          // Pause
    Resume,         // Resume
    Stop,           // Stop and clear
    Seek(f32),      // Seek to seconds
    SetVolume(f32), // 0.0 - 1.0
}

pub struct AudioPlayerState {
    pub tx: Mutex<mpsc::Sender<AudioCommand>>,
}

/// Initializes the audio thread and returns the state to be managed by Tauri.
///
/// # Panics
///
/// Panics if the default audio stream cannot be opened.
#[must_use]
pub fn init_audio_thread(app_handle: AppHandle) -> AudioPlayerState {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        // Lazy initialization: only create stream when needed (first Play command)
        // This avoids initializing CoreAudio during app startup on macOS
        let mut stream = None;
        let mut sink = None;
        let mut current_duration = Duration::from_secs(0);

        loop {
            // Wait for commands with a timeout to allow for periodic status updates
            match rx.recv_timeout(Duration::from_millis(200)) {
                Ok(cmd) => match cmd {
                    AudioCommand::Play(path) => {
                        // Initialize stream and sink on first use
                        if stream.is_none() {
                            match OutputStreamBuilder::open_default_stream() {
                                Ok(s) => {
                                    let new_sink = Sink::connect_new(s.mixer());
                                    stream = Some(s);
                                    sink = Some(new_sink);
                                }
                                Err(e) => {
                                    eprintln!("Audio thread failed to open output stream: {e}");
                                    app_handle
                                        .emit(
                                            "player-error",
                                            format!("Failed to initialize audio: {e}"),
                                        )
                                        .ok();
                                    continue;
                                }
                            }
                        }

                        let sink_ref = sink.as_ref().unwrap();

                        match File::open(&path) {
                            Ok(file) => {
                                let reader = BufReader::new(file);
                                match Decoder::new(reader) {
                                    Ok(source) => {
                                        // Store total duration if available
                                        if let Some(d) = source.total_duration() {
                                            current_duration = d;
                                        } else {
                                            current_duration = Duration::from_secs(0);
                                        }

                                        sink_ref.clear();
                                        sink_ref.append(source);
                                        sink_ref.play();

                                        // Notify frontend
                                        app_handle
                                            .emit(
                                                "player-status",
                                                serde_json::json!({ "status": "playing", "path": path, "duration": current_duration.as_secs_f64() }),
                                            )
                                            .ok();
                                    }
                                    Err(e) => {
                                        eprintln!("Failed to decode audio: {e}");
                                        app_handle
                                            .emit("player-error", format!("Failed to decode: {e}"))
                                            .ok();
                                    }
                                }
                            }
                            Err(e) => {
                                eprintln!("Failed to open file: {e}");
                                app_handle
                                    .emit("player-error", format!("Failed to open file: {e}"))
                                    .ok();
                            }
                        }
                    }
                    AudioCommand::Pause => {
                        if let Some(s) = &sink {
                            s.pause();
                            app_handle
                                .emit("player-status", serde_json::json!({ "status": "paused" }))
                                .ok();
                        }
                    }
                    AudioCommand::Resume => {
                        if let Some(s) = &sink {
                            s.play();
                            app_handle
                                .emit("player-status", serde_json::json!({ "status": "playing" }))
                                .ok();
                        }
                    }
                    AudioCommand::Stop => {
                        if let Some(s) = &sink {
                            s.stop();
                            s.clear();
                            app_handle
                                .emit("player-status", serde_json::json!({ "status": "stopped" }))
                                .ok();
                        }
                    }
                    AudioCommand::Seek(secs) => {
                        if let Some(s) = &sink {
                            if let Err(e) = s.try_seek(Duration::from_secs_f32(secs)) {
                                eprintln!("Seek failed: {e}");
                            }
                        }
                    }
                    AudioCommand::SetVolume(vol) => {
                        if let Some(s) = &sink {
                            s.set_volume(vol);
                        }
                    }
                },
                Err(mpsc::RecvTimeoutError::Timeout) => {
                    // Periodic update: send current position
                    if let Some(s) = &sink {
                        if !s.empty() && !s.is_paused() {
                            let pos = s.get_pos().as_secs_f64();
                            app_handle
                                .emit(
                                    "player-progress",
                                    serde_json::json!({
                                        "position": pos,
                                        "duration": current_duration.as_secs_f64()
                                    }),
                                )
                                .ok();
                        }
                    }
                }
                Err(mpsc::RecvTimeoutError::Disconnected) => {
                    // Channel closed, exit thread
                    break;
                }
            }
        }
    });

    AudioPlayerState { tx: Mutex::new(tx) }
}
