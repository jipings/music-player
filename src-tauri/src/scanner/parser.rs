use lofty::file::{AudioFile, TaggedFileExt};
use lofty::probe::Probe;
use lofty::tag::Accessor;
use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TrackMetadata {
    #[serde(default)]
    pub id: i64,
    pub path: String,
    pub title: Option<String>,
    pub artist: Option<String>,
    pub album: Option<String>,
    pub duration_secs: u64,
    pub cover_mime: Option<String>,
    pub has_cover: bool,
}

/// Parses a media file and extracts metadata.
///
/// # Errors
///
/// Returns an error if:
/// - The file does not exist.
/// - The file cannot be probed or read by `lofty`.
/// - There are issues extracting the tags.
pub fn parse_file(path: &str) -> Result<TrackMetadata, String> {
    let path_obj = Path::new(path);
    if !path_obj.exists() {
        return Err(format!("File not found: {path}"));
    }

    let tagged_file = Probe::open(path_obj)
        .map_err(|e| format!("Failed to probe file: {e}"))?
        .read()
        .map_err(|e| format!("Failed to read file tags: {e}"))?;

    let tag = tagged_file.primary_tag();
    let properties = tagged_file.properties();

    let title = tag.and_then(|t| t.title().map(std::borrow::Cow::into_owned));
    let artist = tag.and_then(|t| t.artist().map(std::borrow::Cow::into_owned));
    let album = tag.and_then(|t| t.album().map(std::borrow::Cow::into_owned));

    let duration_secs = properties.duration().as_secs();

    let (has_cover, cover_mime) = tag.map_or((false, None), |t| {
        t.pictures().first().map_or((false, None), |pic| {
            (
                true,
                Some(pic.mime_type().map_or_else(
                    || "application/octet-stream".to_string(),
                    std::string::ToString::to_string,
                )),
            )
        })
    });

    Ok(TrackMetadata {
        id: 0,
        path: path.to_string(),
        title,
        artist,
        album,
        duration_secs,
        cover_mime,
        has_cover,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use tempfile::NamedTempFile;

    #[test]
    fn test_parse_non_existent_file() {
        let result = parse_file("non_existent_file.mp3");
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("File not found"));
    }

    #[test]
    fn test_parse_invalid_file() {
        let mut temp_file = NamedTempFile::new().unwrap();
        writeln!(temp_file, "not an audio file").unwrap();

        let path = temp_file.path().to_str().unwrap();
        let result = parse_file(path);

        assert!(result.is_err());
        let err = result.unwrap_err();
        assert!(err.contains("Failed to probe file") || err.contains("Failed to read file tags"));
    }

    #[test]
    fn test_parse_valid_asset_file() {
        // Path relative to src-tauri directory where tests run
        let path = "../assets/01 TempleOS Hymn Risen (Remix).mp3";
        let result = parse_file(path);

        if Path::new(path).exists() {
            assert!(
                result.is_ok(),
                "Failed to parse valid asset file: {:?}",
                result.err()
            );
            let metadata = result.unwrap();

            assert_eq!(metadata.path, path);
            assert_eq!(
                metadata.title,
                Some("TempleOS Hymn Risen (Remix)".to_string())
            );
            assert_eq!(metadata.artist, Some("Dave Eddy".to_string()));
            assert!(metadata.duration_secs > 0);
        } else {
            println!("Skipping test: Asset file not found at {}", path);
        }
    }
}
