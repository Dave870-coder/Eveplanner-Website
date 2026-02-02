# Event Planner Backend Setup Guide

## Prerequisites
- Node.js (v14 or higher) installed
- npm (Node Package Manager)

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd "c:\Users\David\3D Objects\Eveplanner Web"
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- **express**: Web framework
- **sqlite3**: Database
- **cors**: Enable cross-origin requests
- **multer**: Handle file uploads
- **uuid**: Generate unique IDs
- **body-parser**: Parse request bodies
- **nodemon**: Auto-reload during development

### 3. Start the Server

**For production:**
```bash
npm start
```

**For development (with auto-reload):**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 4. Database Creation

The SQLite database (`eveplanner.db`) is automatically created when the server starts for the first time. It includes three tables:
- **users**: Stores customer information
- **events**: Stores event details
- **files**: Stores uploaded files metadata

## Folder Structure

```
Eveplanner Web/
├── server.js                    # Main Express server
├── package.json                 # Project dependencies
├── eveplanner.db               # SQLite database (auto-created)
├── database-schema.sql         # Database schema reference
├── API-Documentation.md        # API documentation
├── uploads/                    # Folder for uploaded files (auto-created)
├── index.html
├── biodata.html
├── services.html
└── ... (other HTML/CSS files)
```

## Testing the API

Use tools like Postman, Insomnia, or curl to test the API endpoints.

### Example: Create a User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "gender": "Male",
    "address": "123 Main St"
  }'
```

## API Endpoints Summary

### Users
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get specific user
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user

### Events
- `POST /api/events` - Create event
- `GET /api/events` - Get all events
- `GET /api/events/:eventId` - Get specific event
- `GET /api/users/:userId/events` - Get user's events
- `PUT /api/events/:eventId` - Update event
- `DELETE /api/events/:eventId` - Delete event

### Files
- `POST /api/events/:eventId/files` - Upload file
- `GET /api/events/:eventId/files` - Get event files
- `GET /api/files/:fileId/download` - Download file
- `DELETE /api/files/:fileId` - Delete file

### Other
- `GET /api/statistics` - Dashboard statistics
- `GET /api/health` - Server health check

## Stopping the Server

Press `Ctrl + C` in the terminal to stop the server.

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, modify the PORT variable in `server.js`:
```javascript
const PORT = 5001; // Change to another port
```

### Database Locked Error
If you get a "database is locked" error:
1. Close any other instances of the server
2. Delete `eveplanner.db` and restart the server

### Node Modules Issues
```bash
rm -r node_modules package-lock.json
npm install
```

## Frontend Integration

To connect your HTML forms to the backend, use fetch API:

```javascript
// Create user from biodata form
fetch('http://localhost:5000/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    gender: document.getElementById('gender').value,
    address: document.getElementById('address').value
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Next Steps

1. Update your HTML forms to submit to the backend API
2. Modify `scripts.js` to handle API calls
3. Add authentication if needed
4. Deploy to a production server
