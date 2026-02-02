use crate::scanner::parser::TrackMetadata;
use rusqlite::{params, Connection, Result};
use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Serialize, Clone)]
pub struct LocalFolder {
    pub id: String,
    pub name: String,
    pub path: String,
    #[serde(rename = "songCount")]
    pub song_count: i32,
}

#[derive(Debug, Serialize, Clone)]
pub struct Playlist {
    pub id: String,
    pub name: String,
    #[serde(rename = "createdAt")]
    pub created_at: String,
}

/// Adds multiple tracks to the database.
///
/// # Errors
///
/// Returns an error if the transaction fails or if any insertion fails.
pub fn add_tracks(conn: &mut Connection, tracks: &[TrackMetadata]) -> Result<()> {
    let tx = conn.transaction()?;
    {
        let mut stmt = tx.prepare(
            "INSERT OR IGNORE INTO tracks (path, title, artist, album, duration, cover_mime, has_cover) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        )?;
        for track in tracks {
            // Cast u64 to i64 for SQLite. Assuming duration fits in i64.
            let duration_i64 = i64::try_from(track.duration_secs).unwrap_or(0);
            stmt.execute(params![
                track.path,
                track.title,
                track.artist,
                track.album,
                duration_i64,
                track.cover_mime,
                track.has_cover
            ])?;
        }
    }
    tx.commit()
}

/// Retrieves tracks from the database, optionally filtered by title.
///
/// # Errors
///
/// Returns an error if the query fails.
pub fn get_tracks(conn: &Connection, title_query: Option<String>) -> Result<Vec<TrackMetadata>> {
    let mut query = String::from(
        "SELECT id, path, title, artist, album, duration, cover_mime, has_cover FROM tracks",
    );

    if title_query.is_some() {
        query.push_str(" WHERE title LIKE ?1");
    }

    let mut stmt = conn.prepare(&query)?;

    let rows = if let Some(title) = title_query {
        let pattern = format!("%{title}%");
        stmt.query_map(params![pattern], map_track_row)?
    } else {
        stmt.query_map([], map_track_row)?
    };

    let mut tracks = Vec::new();
    for track in rows {
        tracks.push(track?);
    }

    Ok(tracks)
}

fn map_track_row(row: &rusqlite::Row<'_>) -> Result<TrackMetadata> {
    let duration_i64: i64 = row.get(5)?;
    let duration_secs = u64::try_from(duration_i64).unwrap_or(0);
    Ok(TrackMetadata {
        id: row.get(0)?,
        path: row.get(1)?,
        title: row.get(2)?,
        artist: row.get(3)?,
        album: row.get(4)?,
        duration_secs,
        cover_mime: row.get(6)?,
        has_cover: row.get(7)?,
    })
}

/// Deletes tracks from the database by their IDs.
///
/// # Errors
///
/// Returns an error if the deletion fails.
pub fn delete_tracks(conn: &Connection, ids: &[i64]) -> Result<()> {
    if ids.is_empty() {
        return Ok(());
    }

    let query = format!(
        "DELETE FROM tracks WHERE id IN ({})",
        ids.iter().map(|_| "?").collect::<Vec<_>>().join(",")
    );

    let mut stmt = conn.prepare(&query)?;

    let params: Vec<&dyn rusqlite::ToSql> =
        ids.iter().map(|id| id as &dyn rusqlite::ToSql).collect();

    stmt.execute(params.as_slice())?;

    Ok(())
}

/// Adds a local folder to the database.
///
/// # Errors
///
/// Returns an error if the insertion fails.
pub fn add_folder(conn: &Connection, name: &str, path: &str, song_count: i32) -> Result<String> {
    let id = Uuid::new_v4().to_string();
    conn.execute(
        "INSERT INTO local_folders (id, name, path, song_count) VALUES (?1, ?2, ?3, ?4)",
        params![id, name, path, song_count],
    )?;
    Ok(id)
}

/// Retrieves local folders from the database, optionally filtered by name.
///
/// # Errors
///
/// Returns an error if the query fails.
pub fn get_folders(conn: &Connection, name_query: Option<String>) -> Result<Vec<LocalFolder>> {
    let mut query = String::from("SELECT id, name, path, song_count FROM local_folders");

    if name_query.is_some() {
        query.push_str(" WHERE name LIKE ?1");
    }

    let mut stmt = conn.prepare(&query)?;

    let rows = if let Some(name) = name_query {
        let pattern = format!("%{name}%");
        stmt.query_map(params![pattern], map_folder_row)?
    } else {
        stmt.query_map([], map_folder_row)?
    };

    let mut folders = Vec::new();
    for folder in rows {
        folders.push(folder?);
    }

    Ok(folders)
}

fn map_folder_row(row: &rusqlite::Row<'_>) -> Result<LocalFolder> {
    Ok(LocalFolder {
        id: row.get(0)?,
        name: row.get(1)?,
        path: row.get(2)?,
        song_count: row.get(3)?,
    })
}

/// Deletes local folders from the database by their IDs.
///
/// # Errors
///
/// Returns an error if the deletion fails.
pub fn delete_folders(conn: &Connection, ids: &[String]) -> Result<()> {
    if ids.is_empty() {
        return Ok(());
    }

    let query = format!(
        "DELETE FROM local_folders WHERE id IN ({})",
        ids.iter().map(|_| "?").collect::<Vec<_>>().join(",")
    );

    let mut stmt = conn.prepare(&query)?;

    let params: Vec<&dyn rusqlite::ToSql> =
        ids.iter().map(|id| id as &dyn rusqlite::ToSql).collect();

    stmt.execute(params.as_slice())?;

    Ok(())
}

/// Creates a new playlist.
///
/// # Errors
///
/// Returns an error if the insertion fails.
pub fn create_playlist(conn: &Connection, name: &str) -> Result<String> {
    let id = Uuid::new_v4().to_string();
    conn.execute(
        "INSERT INTO playlists (id, name) VALUES (?1, ?2)",
        params![id, name],
    )?;
    Ok(id)
}

/// Retrieves playlists from the database.
///
/// # Errors
///
/// Returns an error if the query fails.
pub fn get_playlists(conn: &Connection) -> Result<Vec<Playlist>> {
    let mut stmt = conn.prepare("SELECT id, name, created_at FROM playlists ORDER BY name")?;
    let rows = stmt.query_map([], |row| {
        Ok(Playlist {
            id: row.get(0)?,
            name: row.get(1)?,
            created_at: row.get(2)?,
        })
    })?;

    let mut playlists = Vec::new();
    for playlist in rows {
        playlists.push(playlist?);
    }
    Ok(playlists)
}

/// Retrieves tracks belonging to a specific playlist.
///
/// # Errors
///
/// Returns an error if the query fails.
pub fn get_tracks_by_playlist(conn: &Connection, playlist_id: &str) -> Result<Vec<TrackMetadata>> {
    let mut stmt = conn.prepare(
        "SELECT t.id, t.path, t.title, t.artist, t.album, t.duration, t.cover_mime, t.has_cover 
         FROM tracks t
         JOIN playlist_tracks pt ON t.id = pt.track_id
         WHERE pt.playlist_id = ?1
         ORDER BY pt.added_at",
    )?;

    let rows = stmt.query_map(params![playlist_id], map_track_row)?;
    let mut tracks = Vec::new();
    for track in rows {
        tracks.push(track?);
    }
    Ok(tracks)
}

/// Adds tracks to a playlist.
///
/// # Errors
///
/// Returns an error if the transaction fails or insertion fails.
pub fn add_tracks_to_playlist(
    conn: &mut Connection,
    playlist_id: &str,
    track_ids: &[i64],
) -> Result<()> {
    let tx = conn.transaction()?;
    {
        let mut stmt = tx.prepare(
            "INSERT OR IGNORE INTO playlist_tracks (playlist_id, track_id) VALUES (?1, ?2)",
        )?;
        for track_id in track_ids {
            stmt.execute(params![playlist_id, track_id])?;
        }
    }
    tx.commit()
}

/// Deletes tracks from a playlist.
///
/// # Errors
///
/// Returns an error if deletion fails.
pub fn delete_tracks_from_playlist(
    conn: &Connection,
    playlist_id: &str,
    track_ids: &[i64],
) -> Result<()> {
    if track_ids.is_empty() {
        return Ok(());
    }

    let query = format!(
        "DELETE FROM playlist_tracks WHERE playlist_id = ?1 AND track_id IN ({})",
        track_ids.iter().map(|_| "?").collect::<Vec<_>>().join(",")
    );

    let mut stmt = conn.prepare(&query)?;
    let mut params: Vec<&dyn rusqlite::ToSql> = vec![&playlist_id];
    for id in track_ids {
        params.push(id);
    }

    stmt.execute(params.as_slice())?;
    Ok(())
}

/// Deletes a playlist.
///
/// # Errors
///
/// Returns an error if deletion fails.
pub fn delete_playlist(conn: &Connection, playlist_id: &str) -> Result<()> {
    conn.execute("DELETE FROM playlists WHERE id = ?1", params![playlist_id])?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::database::schema::create_tables;

    fn setup_db() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        create_tables(&conn).unwrap();
        conn
    }

    #[test]
    fn test_add_and_get_tracks() {
        let mut conn = setup_db();
        let track = TrackMetadata {
            id: 0,
            path: "/path/to/song.mp3".to_string(),
            title: Some("Song Title".to_string()),
            artist: Some("Artist".to_string()),
            album: None,
            duration_secs: 180,
            cover_mime: None,
            has_cover: false,
        };

        add_tracks(&mut conn, &[track.clone()]).unwrap();

        let tracks = get_tracks(&conn, None).unwrap();
        assert_eq!(tracks.len(), 1);
        assert_eq!(tracks[0].path, track.path);
        assert_eq!(tracks[0].title, track.title);
        assert!(tracks[0].id > 0);
    }

    #[test]
    fn test_get_tracks_filtered() {
        let mut conn = setup_db();
        let tracks = vec![
            TrackMetadata {
                id: 0,
                path: "/a.mp3".to_string(),
                title: Some("Love Song".to_string()),
                artist: None,
                album: None,
                duration_secs: 0,
                cover_mime: None,
                has_cover: false,
            },
            TrackMetadata {
                id: 0,
                path: "/b.mp3".to_string(),
                title: Some("Happy Day".to_string()),
                artist: None,
                album: None,
                duration_secs: 0,
                cover_mime: None,
                has_cover: false,
            },
        ];
        add_tracks(&mut conn, &tracks).unwrap();

        let results = get_tracks(&conn, Some("Love".to_string())).unwrap();
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].title.as_deref(), Some("Love Song"));

        let results_case = get_tracks(&conn, Some("happy".to_string())).unwrap();
        assert_eq!(results_case.len(), 1);
        assert_eq!(results_case[0].title.as_deref(), Some("Happy Day"));

        let results_none = get_tracks(&conn, Some("NotFound".to_string())).unwrap();
        assert!(results_none.is_empty());
    }

    #[test]
    fn test_delete_tracks() {
        let mut conn = setup_db();
        let track = TrackMetadata {
            id: 0,
            path: "/d.mp3".to_string(),
            title: None,
            artist: None,
            album: None,
            duration_secs: 0,
            cover_mime: None,
            has_cover: false,
        };
        add_tracks(&mut conn, &[track]).unwrap();

        let stored = get_tracks(&conn, None).unwrap();
        let id = stored[0].id;

        delete_tracks(&conn, &[id]).unwrap();

        let empty = get_tracks(&conn, None).unwrap();
        assert!(empty.is_empty());
    }

    #[test]
    fn test_add_and_get_folders() {
        let conn = setup_db();
        add_folder(&conn, "Music", "/home/music", 0).unwrap();

        let folders = get_folders(&conn, None).unwrap();
        assert_eq!(folders.len(), 1);
        assert_eq!(folders[0].name, "Music");
        assert_eq!(folders[0].path, "/home/music");
        assert_eq!(folders[0].song_count, 0);
    }

    #[test]
    fn test_get_folders_filtered() {
        let conn = setup_db();
        add_folder(&conn, "Music 1", "/path/1", 10).unwrap();
        add_folder(&conn, "Music 2", "/path/2", 5).unwrap();

        let results = get_folders(&conn, Some("Music 1".to_string())).unwrap();
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].name, "Music 1");
    }

    #[test]
    fn test_delete_folders() {
        let conn = setup_db();
        let id = add_folder(&conn, "To Delete", "/delete", 0).unwrap();

        delete_folders(&conn, &[id]).unwrap();

        let folders = get_folders(&conn, None).unwrap();
        assert!(folders.is_empty());
    }

    #[test]
    fn test_playlist_operations() {
        let mut conn = setup_db();

        // 1. Create Playlists
        let pid1 = create_playlist(&conn, "Favorites").unwrap();
        let pid2 = create_playlist(&conn, "Rock").unwrap();

        let playlists = get_playlists(&conn).unwrap();
        assert_eq!(playlists.len(), 2);
        assert!(playlists.iter().any(|p| p.name == "Favorites"));

        // 2. Add Tracks
        let track = TrackMetadata {
            id: 0,
            path: "/s1.mp3".to_string(),
            title: Some("S1".into()),
            artist: None,
            album: None,
            duration_secs: 0,
            cover_mime: None,
            has_cover: false,
        };
        add_tracks(&mut conn, &[track]).unwrap();
        let tracks = get_tracks(&conn, None).unwrap();
        let track_id = tracks[0].id;

        add_tracks_to_playlist(&mut conn, &pid1, &[track_id]).unwrap();

        // 3. Get Tracks by Playlist
        let p_tracks = get_tracks_by_playlist(&conn, &pid1).unwrap();
        assert_eq!(p_tracks.len(), 1);
        assert_eq!(p_tracks[0].id, track_id);

        let empty_tracks = get_tracks_by_playlist(&conn, &pid2).unwrap();
        assert!(empty_tracks.is_empty());

        // 4. Remove Tracks from Playlist
        delete_tracks_from_playlist(&conn, &pid1, &[track_id]).unwrap();
        let p_tracks_after = get_tracks_by_playlist(&conn, &pid1).unwrap();
        assert!(p_tracks_after.is_empty());

        // 5. Delete Playlist
        delete_playlist(&conn, &pid1).unwrap();
        let playlists_after = get_playlists(&conn).unwrap();
        assert_eq!(playlists_after.len(), 1);
        assert_eq!(playlists_after[0].id, pid2);
    }
}
