use hex;
use lofty::file::{AudioFile, TaggedFileExt};
use lofty::probe::Probe;
use lofty::tag::Accessor;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::fs;
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
    pub cover_img_path: Option<String>,
}

/// Parses a media file and extracts metadata.
///
/// # Errors
///
/// Returns an error if:
/// - The file does not exist.
/// - The file cannot be probed or read by `lofty`.
/// - There are issues extracting the tags.
/// - There are issues saving the cover art (if `images_dir` is provided).
pub fn parse_file(path: &str, images_dir: Option<&Path>) -> Result<TrackMetadata, String> {
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

    let mut cover_mime = None;
    let mut has_cover = false;
    let mut cover_img_path = None;

    if let Some(t) = tag {
        if let Some(pic) = t.pictures().first() {
            has_cover = true;
            let mime = pic.mime_type().map_or_else(
                || "application/octet-stream".to_string(),
                std::string::ToString::to_string,
            );
            cover_mime = Some(mime.clone());

            if let Some(dir) = images_dir {
                if !dir.exists() {
                    fs::create_dir_all(dir)
                        .map_err(|e| format!("Failed to create images directory: {e}"))?;
                }

                let data = pic.data();
                let mut hasher = Sha256::new();
                hasher.update(data);
                let result = hasher.finalize();
                let hash_hex = hex::encode(result);

                // Determine extension from mime
                let ext = match mime.as_str() {
                    "image/jpeg" => "jpg",
                    "image/png" => "png",
                    "image/gif" => "gif",
                    "image/webp" => "webp",
                    _ => "bin",
                };

                let filename = format!("{hash_hex}.{ext}");
                let file_path = dir.join(&filename);

                if !file_path.exists() {
                    fs::write(&file_path, data)
                        .map_err(|e| format!("Failed to save cover image: {e}"))?;
                }

                cover_img_path = file_path.to_str().map(std::string::ToString::to_string);
            }
        }
    }

    Ok(TrackMetadata {
        id: 0,
        path: path.to_string(),
        title,
        artist,
        album,
        duration_secs,
        cover_mime,
        has_cover,
        cover_img_path,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use tempfile::NamedTempFile;

    #[test]
    fn test_parse_non_existent_file() {
        let result = parse_file("non_existent_file.mp3", None);
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("File not found"));
    }

    #[test]
    fn test_parse_invalid_file() {
        let mut temp_file = NamedTempFile::new().unwrap();
        writeln!(temp_file, "not an audio file").unwrap();

        let path = temp_file.path().to_str().unwrap();
        let result = parse_file(path, None);

        assert!(result.is_err());
        let err = result.unwrap_err();
        assert!(err.contains("Failed to probe file") || err.contains("Failed to read file tags"));
    }

    #[test]
    fn test_parse_valid_asset_file() {
        // Path relative to src-tauri directory where tests run
        let path = "../assets/01 TempleOS Hymn Risen (Remix).mp3";
        let result = parse_file(path, None);

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
