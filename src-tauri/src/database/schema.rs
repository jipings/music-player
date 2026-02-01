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
            has_cover INTEGER
        )",
        [],
    )?;
    Ok(())
}
