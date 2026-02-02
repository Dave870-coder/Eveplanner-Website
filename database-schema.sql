-- Database Schema for Event Planner Application

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    fullName TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    gender TEXT,
    address TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    eventType TEXT NOT NULL,
    eventDate TEXT,
    eventTime TEXT,
    guestCount INTEGER,
    budget REAL,
    venue TEXT,
    catering TEXT,
    decorations TEXT,
    photography TEXT,
    music TEXT,
    additionalNotes TEXT,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Files Table
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    eventId TEXT NOT NULL,
    userId TEXT NOT NULL,
    fileName TEXT NOT NULL,
    fileType TEXT,
    filePath TEXT,
    fileSize INTEGER,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_userId ON events(userId);
CREATE INDEX IF NOT EXISTS idx_files_eventId ON files(eventId);
CREATE INDEX IF NOT EXISTS idx_files_userId ON files(userId);
