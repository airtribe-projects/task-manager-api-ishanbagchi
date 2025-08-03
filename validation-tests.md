# Validation Testing Examples

## Valid Request Examples

### Create Task (Valid)

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Node.js",
    "description": "Complete the Node.js tutorial course",
    "completed": false
  }'
```

### Update Task (Valid)

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task Title",
    "completed": true
  }'
```

## Validation Error Examples

### 1. Missing Title

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Task without title"
  }'
# Expected: 400 - "Title is required"
```

### 2. Empty Title

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "   ",
    "description": "Task with empty title"
  }'
# Expected: 400 - "Title cannot be empty or contain only whitespace"
```

### 3. Missing Description

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task without description"
  }'
# Expected: 400 - "Description is required"
```

### 4. Invalid Completed Value

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Test Description",
    "completed": "true"
  }'
# Expected: 400 - "Completed must be a boolean value"
```

### 5. Invalid Task ID

```bash
curl -X GET http://localhost:3000/tasks/abc
# Expected: 400 - "Task ID must be a positive integer"
```

### 6. Negative Task ID

```bash
curl -X GET http://localhost:3000/tasks/-1
# Expected: 400 - "Task ID must be a positive integer"
```

### 7. Non-existent Task ID

```bash
curl -X GET http://localhost:3000/tasks/999
# Expected: 404 - "Task not found"
```

### 8. Invalid Content Type

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: text/plain" \
  -d 'invalid data'
# Expected: 400 - "Content-Type must be application/json"
```

### 9. Invalid JSON

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Invalid JSON", "description"}'
# Expected: 400 - "Request body contains invalid JSON"
```

### 10. Empty Request Body

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{}'
# Expected: 400 - "Request body is required"
```

### 11. Title Too Long (>200 characters)

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "'"$(printf 'A%.0s' {1..201})"'",
    "description": "Test description"
  }'
# Expected: 400 - "Title cannot exceed 200 characters"
```

### 12. Description Too Long (>1000 characters)

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Title",
    "description": "'"$(printf 'A%.0s' {1..1001})"'"
  }'
# Expected: 400 - "Description cannot exceed 1000 characters"
```

### 13. Invalid Fields in Update

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "invalidField": "should not be allowed",
    "anotherInvalid": "also not allowed"
  }'
# Expected: 400 - "No valid fields provided"
```

### 14. Non-existent Route

```bash
curl -X GET http://localhost:3000/invalid-route
# Expected: 404 - "Route not found"
```

### 15. Invalid HTTP Method

```bash
curl -X PATCH http://localhost:3000/tasks/1
# Expected: 404 - "Route not found"
```

## Test All Validation Scenarios Script

```bash
#!/bin/bash

echo "Testing Task Manager API Validations..."

# Start server first: npm start

BASE_URL="http://localhost:3000"

echo "1. Testing valid task creation..."
curl -s -X POST $BASE_URL/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task", "description": "Test Description"}' | jq .

echo -e "\n2. Testing missing title..."
curl -s -X POST $BASE_URL/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "Missing title"}' | jq .

echo -e "\n3. Testing invalid task ID..."
curl -s -X GET $BASE_URL/tasks/abc | jq .

echo -e "\n4. Testing non-existent task..."
curl -s -X GET $BASE_URL/tasks/999 | jq .

echo -e "\n5. Testing invalid content type..."
curl -s -X POST $BASE_URL/tasks \
  -H "Content-Type: text/plain" \
  -d 'invalid' | jq .

echo -e "\nValidation tests complete!"
```
