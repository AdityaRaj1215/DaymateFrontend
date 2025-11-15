# Backend API Documentation

This document outlines the API endpoints that the frontend expects from the backend.

## Base URL
The base URL is configured in `.env` file as `VITE_API_BASE_URL` (default: `http://localhost:3000/api`)

## Authentication

### POST /auth/register
Register a new user. yes

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Headers:**
- All authenticated requests require: `Authorization: Bearer <token>`

## Tasks

### GET /tasks
Get all tasks for the authenticated user.

**Response:**
```json
[
  {
    "id": 1,
    "text": "Complete project",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "text": "New task",
  "completed": false
}
```

**Response:**
```json
{
  "id": 1,
  "text": "New task",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /tasks/:id
Update a task.

**Request Body:**
```json
{
  "text": "Updated task",
  "completed": true
}
```

**Response:**
```json
{
  "id": 1,
  "text": "Updated task",
  "completed": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /tasks/:id
Delete a task.

**Response:**
```json
{
  "success": true
}
```

## Notes

### GET /notes
Get all notes for the authenticated user.

**Response:**
```json
[
  {
    "id": 1,
    "title": "My Note",
    "content": "Note content here",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /notes
Create a new note.

**Request Body:**
```json
{
  "title": "My Note",
  "content": "Note content here"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "My Note",
  "content": "Note content here",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /notes/:id
Update a note.

**Request Body:**
```json
{
  "title": "Updated Note",
  "content": "Updated content"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Updated Note",
  "content": "Updated content",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /notes/:id
Delete a note.

**Response:**
```json
{
  "success": true
}
```

## Reminders

### GET /reminders
Get all reminders for the authenticated user.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Meeting",
    "content": "Team meeting at 3 PM",
    "reminderDate": "2024-01-15",
    "reminderTime": "15:00",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /reminders
Create a new reminder.

**Request Body:**
```json
{
  "title": "Meeting",
  "content": "Team meeting at 3 PM",
  "reminderDate": "2024-01-15",
  "reminderTime": "15:00"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Meeting",
  "content": "Team meeting at 3 PM",
  "reminderDate": "2024-01-15",
  "reminderTime": "15:00",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /reminders/:id
Update a reminder.

**Request Body:**
```json
{
  "title": "Updated Meeting",
  "content": "Updated content",
  "reminderDate": "2024-01-16",
  "reminderTime": "16:00"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Updated Meeting",
  "content": "Updated content",
  "reminderDate": "2024-01-16",
  "reminderTime": "16:00",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /reminders/:id
Delete a reminder.

**Response:**
```json
{
  "success": true
}
```

## Error Responses

All endpoints should return error responses in the following format:

```json
{
  "message": "Error message here",
  "error": "Detailed error information"
}
```

Status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

