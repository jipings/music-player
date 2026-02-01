use rodio::{Decoder, OutputStreamBuilder, Sink};
use std::fs::File;
use std::io::BufReader;
use std::sync::{Arc, Mutex};

pub struct AudioPlayer {
    sink: Arc<Mutex<Sink>>,
}

impl AudioPlayer {
    /// # Errors
    ///
    /// Returns an error if the default audio output stream cannot be opened.
    pub fn new() -> Result<Self, String> {
        // In rodio 0.21, we use OutputStreamBuilder to open the default stream.
        let stream = OutputStreamBuilder::open_default_stream()
            .map_err(|e| format!("Failed to open audio output stream: {e}"))?;

        // Leak the stream to keep it alive globally.
        let stream_ref = Box::leak(Box::new(stream));

        // Create the sink using the mixer from the stream reference.
        let sink = Sink::connect_new(stream_ref.mixer());

        Ok(Self {
            sink: Arc::new(Mutex::new(sink)),
        })
    }

    /// # Errors
    ///
    /// Returns an error if the file cannot be opened, decoded, or if the sink mutex is poisoned.
    pub fn load_track(&self, path: &str) -> Result<(), String> {
        let file =
            File::open(path).map_err(|e| format!("Failed to open file '{path}': {e}"))?;
        let reader = BufReader::new(file);

        let source =
            Decoder::new(reader).map_err(|e| format!("Failed to decode audio file: {e}"))?;

        let sink = self.sink.lock().map_err(|_| "Failed to lock sink mutex")?;

        // Clear existing queue before playing new track
        sink.clear();
        sink.append(source);
        sink.play();
        drop(sink);

        Ok(())
    }

    pub fn play(&self) {
        if let Ok(sink) = self.sink.lock() {
            sink.play();
        }
    }

    pub fn pause(&self) {
        if let Ok(sink) = self.sink.lock() {
            sink.pause();
        }
    }

    pub fn stop(&self) {
        if let Ok(sink) = self.sink.lock() {
            // Stop playback and clear the queue
            sink.pause(); // Pause first to stop immediate playback
            sink.clear();
        }
    }

    pub fn set_volume(&self, volume: f32) {
        if let Ok(sink) = self.sink.lock() {
            sink.set_volume(volume);
        }
    }

    #[must_use]
    pub fn is_paused(&self) -> bool {
        self.sink.lock().is_ok_and(|sink| sink.is_paused())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // Note: These tests require an audio device. In CI environments without audio,
    // they might fail or need to be skipped.

    #[test]
    fn test_player_creation() {
        match AudioPlayer::new() {
            Ok(player) => {
                // If device exists, player should be created
                assert!(player.sink.lock().is_ok());
            }
            Err(_) => {
                // If no device, it returns error, which is acceptable in some envs
                println!("Skipping test: No audio device found");
            }
        }
    }

    #[test]
    fn test_volume_control() {
        if let Ok(player) = AudioPlayer::new() {
            player.set_volume(0.5);
            // We can't easily verify internal state of Sink without a getter,
            // but we ensure it doesn't panic.
        }
    }
}