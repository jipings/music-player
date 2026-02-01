use rusqlite::Connection;

/// # Errors
///
/// Returns an error if the database connection cannot be opened or if table creation fails.
pub fn init_db() -> Result<Connection, rusqlite::Error> {
    let conn = Connection::open("music_player.db")?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS tracks (
            id INTEGER PRIMARY KEY,
            path TEXT NOT NULL UNIQUE,
            title TEXT,
            artist TEXT,
            album TEXT,
            duration INTEGER
        )",
        [],
    )?;

    Ok(conn)
}
