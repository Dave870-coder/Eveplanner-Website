const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname)));

// Security headers to reduce ability to tamper with pages from the browser
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Reduce referrer leakage
  res.setHeader('Referrer-Policy', 'no-referrer');
  // Disable powerful features
  res.setHeader('Permissions-Policy', "geolocation=(), microphone=(), camera=()");
  // Explicitly disable old XSS filter (handled by modern CSP)
  res.setHeader('X-XSS-Protection', '0');
  // Content Security Policy - restrict where resources may be loaded from
  // Keep it conservative: allow same-origin and https resources only
  res.setHeader('Content-Security-Policy', "default-src 'self' https:; script-src 'self' https:; connect-src 'self' https:; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; object-src 'none'; frame-ancestors 'none'; base-uri 'self';");
  next();
});

// Upload directory setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Initialize SQLite Database
const db = new sqlite3.Database(path.join(__dirname, 'eveplanner.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        gender TEXT,
        address TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Events table
    db.run(`
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
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Files table
    db.run(`
      CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        eventId TEXT NOT NULL,
        userId TEXT NOT NULL,
        fileName TEXT NOT NULL,
        fileType TEXT,
        filePath TEXT,
        fileSize INTEGER,
        uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (eventId) REFERENCES events(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    console.log('Database tables initialized successfully');
  });
}

// ==================== USER ENDPOINTS ====================

// Create a new user from biodata form
app.post('/api/users', (req, res) => {
  const { fullName, email, phone, gender, address } = req.body;
  const userId = uuidv4();

  const query = `
    INSERT INTO users (id, fullName, email, phone, gender, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [userId, fullName, email, phone, gender, address], function(err) {
    if (err) {
      console.error('Error creating user:', err.message);
      res.status(400).json({ error: err.message });
    } else {
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        userId: userId
      });
    }
  });
});

// Get user by ID
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';

  db.get(query, [userId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(row);
    }
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM users';

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Update user
app.put('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const { fullName, email, phone, gender, address } = req.body;

  const query = `
    UPDATE users
    SET fullName = ?, email = ?, phone = ?, gender = ?, address = ?
    WHERE id = ?
  `;

  db.run(query, [fullName, email, phone, gender, address, userId], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ success: true, message: 'User updated successfully' });
    }
  });
});

// Delete user
app.delete('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';

  db.run(query, [userId], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ success: true, message: 'User deleted successfully' });
    }
  });
});

// ==================== EVENT ENDPOINTS ====================

// Create a new event
app.post('/api/events', (req, res) => {
  const {
    userId, eventType, eventDate, eventTime, guestCount,
    budget, venue, catering, decorations, photography, music, additionalNotes
  } = req.body;
  
  const eventId = uuidv4();

  const query = `
    INSERT INTO events (
      id, userId, eventType, eventDate, eventTime, guestCount, budget,
      venue, catering, decorations, photography, music, additionalNotes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    eventId, userId, eventType, eventDate, eventTime, guestCount,
    budget, venue, catering, decorations, photography, music, additionalNotes
  ];

  db.run(query, values, function(err) {
    if (err) {
      console.error('Error creating event:', err.message);
      res.status(400).json({ error: err.message });
    } else {
      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        eventId: eventId
      });
    }
  });
});

// Get event by ID
app.get('/api/events/:eventId', (req, res) => {
  const { eventId } = req.params;
  const query = 'SELECT * FROM events WHERE id = ?';

  db.get(query, [eventId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Event not found' });
    } else {
      res.json(row);
    }
  });
});

// Get all events for a user
app.get('/api/users/:userId/events', (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM events WHERE userId = ?';

  db.all(query, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get all events
app.get('/api/events', (req, res) => {
  const query = 'SELECT * FROM events';

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Update event
app.put('/api/events/:eventId', (req, res) => {
  const { eventId } = req.params;
  const {
    eventType, eventDate, eventTime, guestCount, budget,
    venue, catering, decorations, photography, music, additionalNotes, status
  } = req.body;

  const query = `
    UPDATE events
    SET eventType = ?, eventDate = ?, eventTime = ?, guestCount = ?, budget = ?,
        venue = ?, catering = ?, decorations = ?, photography = ?, music = ?,
        additionalNotes = ?, status = ?
    WHERE id = ?
  `;

  const values = [
    eventType, eventDate, eventTime, guestCount, budget,
    venue, catering, decorations, photography, music, additionalNotes, status, eventId
  ];

  db.run(query, values, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ success: true, message: 'Event updated successfully' });
    }
  });
});

// Delete event
app.delete('/api/events/:eventId', (req, res) => {
  const { eventId } = req.params;
  const query = 'DELETE FROM events WHERE id = ?';

  db.run(query, [eventId], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ success: true, message: 'Event deleted successfully' });
    }
  });
});

// ==================== FILE ENDPOINTS ====================

// Upload file for an event
app.post('/api/events/:eventId/files', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const { eventId } = req.params;
  const { userId } = req.body;
  const fileId = uuidv4();

  const query = `
    INSERT INTO files (id, eventId, userId, fileName, fileType, filePath, fileSize)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    fileId,
    eventId,
    userId,
    req.file.originalname,
    req.file.mimetype,
    req.file.path,
    req.file.size
  ];

  db.run(query, values, function(err) {
    if (err) {
      console.error('Error saving file record:', err.message);
      // Delete the uploaded file if database save fails
      fs.unlinkSync(req.file.path);
      res.status(400).json({ error: err.message });
    } else {
      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        fileId: fileId,
        fileName: req.file.originalname
      });
    }
  });
});

// Get all files for an event
app.get('/api/events/:eventId/files', (req, res) => {
  const { eventId } = req.params;
  const query = 'SELECT id, fileName, fileType, fileSize, uploadedAt FROM files WHERE eventId = ?';

  db.all(query, [eventId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Download file
app.get('/api/files/:fileId/download', (req, res) => {
  const { fileId } = req.params;
  const query = 'SELECT * FROM files WHERE id = ?';

  db.get(query, [fileId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'File not found' });
    } else {
      const filePath = row.filePath;
      if (fs.existsSync(filePath)) {
        res.download(filePath, row.fileName);
      } else {
        res.status(404).json({ error: 'File does not exist on server' });
      }
    }
  });
});

// Delete file
app.delete('/api/files/:fileId', (req, res) => {
  const { fileId } = req.params;
  const query = 'SELECT filePath FROM files WHERE id = ?';

  db.get(query, [fileId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'File not found' });
    } else {
      // Delete file from disk
      if (fs.existsSync(row.filePath)) {
        fs.unlinkSync(row.filePath);
      }

      // Delete file record from database
      const deleteQuery = 'DELETE FROM files WHERE id = ?';
      db.run(deleteQuery, [fileId], function(err) {
        if (err) {
          res.status(400).json({ error: err.message });
        } else {
          res.json({ success: true, message: 'File deleted successfully' });
        }
      });
    }
  });
});

// ==================== STATISTICS ENDPOINTS ====================

// Get dashboard statistics
app.get('/api/statistics', (req, res) => {
  db.all(`SELECT COUNT(*) as totalUsers FROM users`, [], (err, users) => {
    db.all(`SELECT COUNT(*) as totalEvents FROM events`, [], (err, events) => {
      db.all(`SELECT COUNT(*) as totalFiles FROM files`, [], (err, files) => {
        res.json({
          totalUsers: users[0]?.totalUsers || 0,
          totalEvents: events[0]?.totalEvents || 0,
          totalFiles: files[0]?.totalFiles || 0
        });
      });
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});
