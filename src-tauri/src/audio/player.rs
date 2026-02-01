use std::sync::{Arc, Mutex};

pub struct AudioPlayer {
    sink: Arc<Mutex<rodio::Sink>>,
}

impl AudioPlayer {
    pub fn new() -> Self {
        // Use fully qualified names to avoid ambiguity
        let (stream, stream_handle) = rodio::OutputStream::try_default().unwrap();
        
        // Leak the stream to keep it alive
        Box::leak(Box::new(stream));
        
        let sink = rodio::Sink::try_new(&stream_handle).unwrap();
        
        Self {
            sink: Arc::new(Mutex::new(sink)),
        }
    }

    pub fn play(&self) {
        self.sink.lock().unwrap().play();
    }

    pub fn pause(&self) {
        self.sink.lock().unwrap().pause();
    }
}
