# Extended Features Testing Guide

## New Features Implemented

### 1. Priority Attribute

-   Added `priority` field to tasks (low, medium, high)
-   Default priority is `medium`
-   Included in task creation and updates

### 2. Filtering by Completion Status

-   Query parameter: `?completed=true` or `?completed=false`
-   Filter tasks by their completion status

### 3. Sorting by Creation Date (and other fields)

-   Query parameters: `?sortBy=createdAt&order=desc` (default)
-   Supported sort fields: `createdAt`, `title`, `priority`, `completed`
-   Supported order: `asc` or `desc`

### 4. Priority-Specific Endpoint

-   New endpoint: `GET /tasks/priority/:level`
-   Retrieve tasks by priority level (low/medium/high)

## API Examples

### Creating Tasks with Priority

```bash
# High priority task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Critical Bug Fix",
    "description": "Fix production issue immediately",
    "priority": "high"
  }'

# Medium priority task (default)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Feature Enhancement",
    "description": "Add new feature to dashboard"
  }'

# Low priority task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Documentation Update",
    "description": "Update API documentation",
    "priority": "low"
  }'
```

### Filtering Tasks

```bash
# Get only completed tasks
curl "http://localhost:3000/tasks?completed=true"

# Get only incomplete tasks
curl "http://localhost:3000/tasks?completed=false"

# Response format when filtering:
{
  "tasks": [...],
  "count": 5,
  "filters": {
    "completed": true
  },
  "sorting": {
    "sortBy": "createdAt",
    "order": "desc"
  }
}
```

### Sorting Tasks

```bash
# Sort by creation date (newest first) - Default
curl "http://localhost:3000/tasks?sortBy=createdAt&order=desc"

# Sort by creation date (oldest first)
curl "http://localhost:3000/tasks?sortBy=createdAt&order=asc"

# Sort by title alphabetically
curl "http://localhost:3000/tasks?sortBy=title&order=asc"

# Sort by priority (high to low)
curl "http://localhost:3000/tasks?sortBy=priority&order=desc"

# Sort by completion status
curl "http://localhost:3000/tasks?sortBy=completed&order=desc"
```

### Combining Filters and Sorting

```bash
# Get completed tasks sorted by priority
curl "http://localhost:3000/tasks?completed=true&sortBy=priority&order=desc"

# Get incomplete high priority tasks
curl "http://localhost:3000/tasks?completed=false&sortBy=createdAt&order=asc"
```

### Priority-Specific Endpoints

```bash
# Get all high priority tasks
curl "http://localhost:3000/tasks/priority/high"

# Get all medium priority tasks
curl "http://localhost:3000/tasks/priority/medium"

# Get all low priority tasks
curl "http://localhost:3000/tasks/priority/low"

# Response format:
{
  "tasks": [...],
  "count": 3,
  "priority": "high"
}
```

### Updating Tasks with Priority

```bash
# Update task priority
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "priority": "high",
    "completed": true
  }'

# Update only priority
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "priority": "low"
  }'
```

## Validation Examples

### Valid Priority Values

```bash
# Valid priorities: low, medium, high
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "description": "Test",
    "priority": "high"
  }'
```

### Invalid Priority (Error)

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "description": "Test",
    "priority": "urgent"
  }'
# Returns: 400 - "Priority must be one of: low, medium, high"
```

### Invalid Priority Level in URL (Error)

```bash
curl "http://localhost:3000/tasks/priority/urgent"
# Returns: 400 - "Priority level must be one of: low, medium, high"
```

### Invalid Completed Filter (Error)

```bash
curl "http://localhost:3000/tasks?completed=maybe"
# Returns: 400 - "completed parameter must be \"true\" or \"false\""
```

### Invalid Sort Field (Error)

```bash
curl "http://localhost:3000/tasks?sortBy=invalid"
# Returns: 400 - "sortBy must be one of: createdAt, title, priority, completed"
```

### Invalid Sort Order (Error)

```bash
curl "http://localhost:3000/tasks?order=random"
# Returns: 400 - "order parameter must be \"asc\" or \"desc\""
```

## Backward Compatibility

-   All existing endpoints continue to work as before
-   When no query parameters are provided, GET /tasks returns just the tasks array (for existing tests)
-   When query parameters are provided, GET /tasks returns an object with metadata
-   All existing task fields remain unchanged
-   Priority defaults to "medium" for tasks created without specifying priority

## Task Schema (Updated)

```json
{
	"id": 1,
	"title": "Task title",
	"description": "Task description",
	"completed": false,
	"priority": "medium",
	"createdAt": "2025-07-31T15:44:04.572Z"
}
```

## Complete Endpoint Summary

| Method | Endpoint                 | Description           | Query Parameters                                    |
| ------ | ------------------------ | --------------------- | --------------------------------------------------- |
| GET    | `/tasks`                 | Get all tasks         | `?completed=true/false&sortBy=field&order=asc/desc` |
| GET    | `/tasks/:id`             | Get task by ID        | None                                                |
| GET    | `/tasks/priority/:level` | Get tasks by priority | None                                                |
| POST   | `/tasks`                 | Create new task       | None                                                |
| PUT    | `/tasks/:id`             | Update task           | None                                                |
| DELETE | `/tasks/:id`             | Delete task           | None                                                |
