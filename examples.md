# Task Manager API - cURL Examples

## 1. Get all tasks

```bash
curl -X GET http://localhost:3000/tasks
```

## 2. Get a specific task by ID

```bash
curl -X GET http://localhost:3000/tasks/1
```

## 3. Create a new task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Node.js",
    "description": "Complete the Node.js tutorial",
    "completed": false
  }'
```

## 4. Update an existing task

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task Title",
    "completed": true
  }'
```

## 5. Delete a task

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Error Examples

### Get non-existent task

```bash
curl -X GET http://localhost:3000/tasks/999
```

### Create task with missing data

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Incomplete Task"
  }'
```

### Update non-existent task

```bash
curl -X PUT http://localhost:3000/tasks/999 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "This will fail"
  }'
```
