use lofty::file::TaggedFileExt;
use lofty::probe::Probe;
use std::path::Path;

pub fn parse_file(path: &str) {
    let path = Path::new(path);
    let tagged_file = Probe::open(path)
        .expect("ERROR: Bad path provided!")
        .read()
        .expect("ERROR: Failed to read file!");

    let tag = tagged_file.primary_tag();
    // Extract metadata
}
