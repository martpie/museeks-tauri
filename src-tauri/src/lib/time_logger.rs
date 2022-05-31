/**
 * Small utility to display time metrics with a log message
 */
use std::time::Instant;

pub struct TimeLogger {
    start_time: Instant,
    message: String,
}

impl TimeLogger {
    pub fn new(message: String) -> Self {
        TimeLogger {
            start_time: Instant::now(),
            message,
        }
    }

    pub fn complete(&self) {
        let duration = self.start_time.elapsed();
        info!("{} in {:.2?}", self.message, duration);
    }
}
