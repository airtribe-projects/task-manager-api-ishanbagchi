# Task Manager API

A RESTful API for managing tasks with CRUD operations built with Express.js and in-memory storage.

## Project Structure

```
├── app.js                 # Main Express application
├── server.js             # Server startup file
├── package.json          # Dependencies and scripts
├── task.json            # Initial data file
├── test/                # Test files
│   └── server.test.js   # API tests
└── src/                 # Source code
    ├── controllers/     # Route handlers
    │   └── taskController.js
    ├── middleware/      # Custom middleware
    │   └── errorMiddleware.js
    ├── models/         # Data models
    │   └── Task.js
    ├── routes/         # Route definitions
    │   ├── index.js
    │   └── taskRoutes.js
    └── services/       # Business logic
        └── taskService.js
```

## Task Schema

```json
{
	"id": 2,
	"title": "Create a new project",
	"description": "Create a new project using Magic",
	"completed": false
}
```

## API Endpoints

### GET /tasks

Retrieve all tasks.

**Response:**

-   `200 OK` - Returns array of all tasks
-   `500 Internal Server Error` - Server error

**Example:**

```bash
curl http://localhost:3000/tasks
```

### GET /tasks/:id

Retrieve a specific task by its ID.

**Parameters:**

-   `id` (number) - Task ID

**Response:**

-   `200 OK` - Returns the task object
-   `404 Not Found` - Task not found
-   `500 Internal Server Error` - Server error

**Example:**

```bash
curl http://localhost:3000/tasks/1
```

### POST /tasks

Create a new task with the required fields.

**Request Body:**

```json
{
  "title": "Task title (required)",
  "description": "Task description (required)",
  "completed": false (optional, defaults to false)
}
```

**Response:**

-   `201 Created` - Returns the created task object
-   `400 Bad Request` - Invalid data provided
-   `500 Internal Server Error` - Server error

**Example:**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "completed": false
  }'
```

### PUT /tasks/:id

Update an existing task by its ID.

**Parameters:**

-   `id` (number) - Task ID

**Request Body (all fields optional):**

```json
{
	"title": "Updated title",
	"description": "Updated description",
	"completed": true
}
```

**Response:**

-   `200 OK` - Returns the updated task object
-   `400 Bad Request` - Invalid data provided
-   `404 Not Found` - Task not found
-   `500 Internal Server Error` - Server error

**Example:**

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "completed": true
  }'
```

### DELETE /tasks/:id

Delete a task by its ID.

**Parameters:**

-   `id` (number) - Task ID

**Response:**

-   `200 OK` - Returns success message and deleted task
-   `404 Not Found` - Task not found
-   `500 Internal Server Error` - Server error

**Example:**

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Installation & Setup

1. Clone the repository
2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Or start the production server:

    ```bash
    npm start
    ```

5. The API will be available at `http://localhost:3000`

## Testing

Run the test suite:

```bash
npm test
```

## Development

For development with auto-reload, you can install nodemon:

```bash
npm install -g nodemon
npm run dev
```

## Features

-   ✅ In-memory data storage
-   ✅ RESTful API design
-   ✅ Comprehensive input validation with detailed error messages
-   ✅ Enhanced error handling with proper HTTP status codes
-   ✅ Request sanitization and security measures
-   ✅ Parameter validation for task IDs
-   ✅ Content-type validation for POST/PUT requests
-   ✅ Field length validation (title: 200 chars, description: 1000 chars)
-   ✅ Clean project structure with middleware separation
-   ✅ Comprehensive test suite (19 tests passing)
-   ✅ Initial data loading from JSON file

## Validation Rules

### Task Creation (POST /tasks)

-   **Title**: Required, non-empty string, max 200 characters
-   **Description**: Required, non-empty string, max 1000 characters
-   **Completed**: Optional boolean (defaults to false)
-   **Content-Type**: Must be application/json

### Task Updates (PUT /tasks/:id)

-   **Title**: Optional, non-empty string, max 200 characters
-   **Description**: Optional, non-empty string, max 1000 characters
-   **Completed**: Optional boolean
-   **Task ID**: Must be positive integer
-   **Content-Type**: Must be application/json

### Error Responses

All validation errors return HTTP 400 with detailed error messages:

```json
{
	"error": "Validation failed",
	"details": ["Specific error messages"]
}
```

## Notes

-   Data is stored in memory and will be reset when the server restarts
-   Initial data is loaded from `task.json` file on startup
-   All tasks require both `title` and `description` fields
-   The `completed` field defaults to `false` if not provided
