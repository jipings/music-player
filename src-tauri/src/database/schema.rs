use rusqlite::Connection;

/// # Errors
///
/// Returns an error if the database connection cannot be opened or if table creation fails.
pub fn init_db() -> Result<Connection, rusqlite::Error> {
    let conn = Connection::open("music_player.db")?;
    create_tables(&conn)?;
    Ok(conn)
}

/// Creates the necessary database tables if they do not exist.
///
/// # Errors
///
/// Returns an error if table creation fails.
pub fn create_tables(conn: &Connection) -> Result<(), rusqlite::Error> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS tracks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT NOT NULL UNIQUE,
            title TEXT,
            artist TEXT,
            album TEXT,
            duration INTEGER,
            cover_mime TEXT,
            has_cover INTEGER,
            cover_img_path TEXT
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS local_folders (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            path TEXT NOT NULL UNIQUE,
            song_count INTEGER DEFAULT 0
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS playlists (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS playlist_tracks (
            playlist_id TEXT,
            track_id INTEGER,
            added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (playlist_id, track_id),
            FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
            FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
        )",
        [],
    )?;
    Ok(())
}
