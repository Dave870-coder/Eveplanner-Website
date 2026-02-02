# Event Planner API Documentation

## Base URL
```
http://localhost:5000/api
```

## Database Structure

### Tables

#### Users Table
Stores customer information from the biodata form.
```sql
users (id, fullName, email, phone, gender, address, createdAt)
```

#### Events Table
Stores event details for each user.
```sql
events (id, userId, eventType, eventDate, eventTime, guestCount, budget, venue, catering, decorations, photography, music, additionalNotes, status, createdAt)
```

#### Files Table
Stores uploaded event-related files.
```sql
files (id, eventId, userId, fileName, fileType, filePath, fileSize, uploadedAt)
```

---

## API Endpoints

### USER ENDPOINTS

#### 1. Create User (POST)
```
POST /api/users
```
**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "gender": "Male",
  "address": "123 Main St, City, State"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "userId": "uuid-string"
}
```

#### 2. Get User (GET)
```
GET /api/users/:userId
```
**Response:**
```json
{
  "id": "uuid-string",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "gender": "Male",
  "address": "123 Main St",
  "createdAt": "2026-02-02T10:00:00.000Z"
}
```

#### 3. Get All Users (GET)
```
GET /api/users
```
**Response:**
```json
[
  { "id": "...", "fullName": "..." },
  { "id": "...", "fullName": "..." }
]
```

#### 4. Update User (PUT)
```
PUT /api/users/:userId
```
**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "0987654321",
  "gender": "Female",
  "address": "456 Oak Ave"
}
```

#### 5. Delete User (DELETE)
```
DELETE /api/users/:userId
```

---

### EVENT ENDPOINTS

#### 1. Create Event (POST)
```
POST /api/events
```
**Request Body:**
```json
{
  "userId": "user-uuid",
  "eventType": "Wedding",
  "eventDate": "2026-06-15",
  "eventTime": "18:00",
  "guestCount": 200,
  "budget": 50000,
  "venue": "Grand Ballroom",
  "catering": "5-star cuisine",
  "decorations": "Floral arrangements",
  "photography": "Professional photography",
  "music": "Live band",
  "additionalNotes": "Outdoor ceremony"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Event created successfully",
  "eventId": "uuid-string"
}
```

#### 2. Get Event (GET)
```
GET /api/events/:eventId
```

#### 3. Get User's Events (GET)
```
GET /api/users/:userId/events
```

#### 4. Get All Events (GET)
```
GET /api/events
```

#### 5. Update Event (PUT)
```
PUT /api/events/:eventId
```
**Request Body:** Same as Create Event + status field
```json
{
  "eventType": "Wedding",
  "eventDate": "2026-06-15",
  "status": "confirmed",
  ...
}
```

#### 6. Delete Event (DELETE)
```
DELETE /api/events/:eventId
```

---

### FILE ENDPOINTS

#### 1. Upload File (POST)
```
POST /api/events/:eventId/files
```
**Request Type:** Form-data
**Fields:**
- `file` (file) - The file to upload
- `userId` (text) - The user ID

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileId": "uuid-string",
  "fileName": "event-plan.pdf"
}
```

#### 2. Get Event Files (GET)
```
GET /api/events/:eventId/files
```
**Response:**
```json
[
  {
    "id": "uuid-string",
    "fileName": "event-plan.pdf",
    "fileType": "application/pdf",
    "fileSize": 2048576,
    "uploadedAt": "2026-02-02T10:00:00.000Z"
  }
]
```

#### 3. Download File (GET)
```
GET /api/files/:fileId/download
```
Downloads the file directly.

#### 4. Delete File (DELETE)
```
DELETE /api/files/:fileId
```

---

### STATISTICS ENDPOINTS

#### Get Dashboard Statistics (GET)
```
GET /api/statistics
```
**Response:**
```json
{
  "totalUsers": 25,
  "totalEvents": 15,
  "totalFiles": 48
}
```

---

### HEALTH CHECK

#### Server Health (GET)
```
GET /api/health
```
**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2026-02-02T10:00:00.000Z"
}
```

---

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

3. Server runs on `http://localhost:5000`

---

## Database File
The SQLite database is stored as `eveplanner.db` in the project root directory.

---

## Features

✅ User Management (CRUD operations)
✅ Event Management (CRUD operations)
✅ File Upload & Storage
✅ File Download & Deletion
✅ Event Status Tracking
✅ Dashboard Statistics
✅ CORS enabled for frontend integration
✅ Error handling
✅ Automatic database initialization

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

Error responses:
```json
{
  "error": "Error message describing what went wrong"
}
```
