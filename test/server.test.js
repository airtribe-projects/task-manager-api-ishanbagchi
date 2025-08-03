const tap = require('tap')
const supertest = require('supertest')
const app = require('../app')
const server = supertest(app)

tap.test('POST /api/v1/tasks', async (t) => {
	const newTask = {
		title: 'New Task',
		description: 'New Task Description',
		completed: false,
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 201)
	t.end()
})

tap.test('POST /api/v1/tasks with invalid data', async (t) => {
	const newTask = {
		title: 'New Task',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('GET /api/v1/tasks', async (t) => {
	const response = await server.get('/api/v1/tasks')
	t.equal(response.status, 200)
	t.hasOwnProp(response.body[0], 'id')
	t.hasOwnProp(response.body[0], 'title')
	t.hasOwnProp(response.body[0], 'description')
	t.hasOwnProp(response.body[0], 'completed')
	t.type(response.body[0].id, 'number')
	t.type(response.body[0].title, 'string')
	t.type(response.body[0].description, 'string')
	t.type(response.body[0].completed, 'boolean')
	t.end()
})

tap.test('GET /api/v1/tasks/:id', async (t) => {
	const response = await server.get('/api/v1/tasks/1')
	t.equal(response.status, 200)
	const expectedTask = {
		id: 1,
		title: 'Set up environment',
		description: 'Install Node.js, npm, and git',
		completed: true,
	}
	t.match(response.body, expectedTask)
	t.end()
})

tap.test('GET /api/v1/tasks/:id with invalid id', async (t) => {
	const response = await server.get('/api/v1/tasks/999')
	t.equal(response.status, 404)
	t.end()
})

tap.test('PUT /api/v1/tasks/:id', async (t) => {
	const updatedTask = {
		title: 'Updated Task',
		description: 'Updated Task Description',
		completed: true,
	}
	const response = await server.put('/api/v1/tasks/1').send(updatedTask)
	t.equal(response.status, 200)
	t.end()
})

tap.test('PUT /api/v1/tasks/:id with invalid id', async (t) => {
	const updatedTask = {
		title: 'Updated Task',
		description: 'Updated Task Description',
		completed: true,
	}
	const response = await server.put('/api/v1/tasks/999').send(updatedTask)
	t.equal(response.status, 404)
	t.end()
})

tap.test('PUT /api/v1/tasks/:id with invalid data', async (t) => {
	const updatedTask = {
		title: 'Updated Task',
		description: 'Updated Task Description',
		completed: 'true',
	}
	const response = await server.put('/api/v1/tasks/1').send(updatedTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('DELETE /api/v1/tasks/:id', async (t) => {
	const response = await server.delete('/api/v1/tasks/1')
	t.equal(response.status, 200)
	t.end()
})

tap.test('DELETE /api/v1/tasks/:id with invalid id', async (t) => {
	const response = await server.delete('/api/v1/tasks/999')
	t.equal(response.status, 404)
	t.end()
})

// Test query parameter validation and filtering
tap.test('GET /api/v1/tasks with completed=true filter', async (t) => {
	const response = await server.get('/api/v1/tasks?completed=true')
	t.equal(response.status, 200)
	t.hasOwnProp(response.body, 'tasks')
	t.hasOwnProp(response.body, 'count')
	t.hasOwnProp(response.body, 'filters')
	t.hasOwnProp(response.body, 'sorting')
	t.end()
})

tap.test('GET /api/v1/tasks with completed=false filter', async (t) => {
	const response = await server.get('/api/v1/tasks?completed=false')
	t.equal(response.status, 200)
	t.hasOwnProp(response.body, 'tasks')
	t.equal(response.body.filters.completed, false)
	t.end()
})

tap.test('GET /api/v1/tasks with invalid completed filter', async (t) => {
	const response = await server.get('/api/v1/tasks?completed=invalid')
	t.equal(response.status, 400)
	t.end()
})

tap.test('GET /api/v1/tasks with sortBy=title', async (t) => {
	const response = await server.get('/api/v1/tasks?sortBy=title')
	t.equal(response.status, 200)
	t.equal(response.body.sorting.sortBy, 'title')
	t.end()
})

tap.test('GET /api/v1/tasks with invalid sortBy', async (t) => {
	const response = await server.get('/api/v1/tasks?sortBy=invalid')
	t.equal(response.status, 400)
	t.end()
})

tap.test('GET /api/v1/tasks with order=asc', async (t) => {
	const response = await server.get('/api/v1/tasks?order=asc')
	t.equal(response.status, 200)
	t.equal(response.body.sorting.order, 'asc')
	t.end()
})

tap.test('GET /api/v1/tasks with invalid order', async (t) => {
	const response = await server.get('/api/v1/tasks?order=invalid')
	t.equal(response.status, 400)
	t.end()
})

// Test priority endpoints
tap.test('GET /api/v1/tasks/priority/high', async (t) => {
	const response = await server.get('/api/v1/tasks/priority/high')
	t.equal(response.status, 200)
	t.hasOwnProp(response.body, 'tasks')
	t.hasOwnProp(response.body, 'count')
	t.hasOwnProp(response.body, 'priority')
	t.equal(response.body.priority, 'high')
	t.end()
})

tap.test('GET /api/v1/tasks/priority/medium', async (t) => {
	const response = await server.get('/api/v1/tasks/priority/medium')
	t.equal(response.status, 200)
	t.equal(response.body.priority, 'medium')
	t.end()
})

tap.test('GET /api/v1/tasks/priority/low', async (t) => {
	const response = await server.get('/api/v1/tasks/priority/low')
	t.equal(response.status, 200)
	t.equal(response.body.priority, 'low')
	t.end()
})

tap.test('GET /api/v1/tasks/priority/invalid', async (t) => {
	const response = await server.get('/api/v1/tasks/priority/invalid')
	t.equal(response.status, 400)
	t.end()
})

// Test validation middleware edge cases
tap.test('POST /api/v1/tasks without content-type header', async (t) => {
	const response = await server
		.post('/api/v1/tasks')
		.unset('Content-Type')
		.send('{"title": "Test", "description": "Test"}')
	t.equal(response.status, 415) // Supertest automatically sets content-type when using .send() with JSON
	t.end()
})

tap.test('PUT /api/v1/tasks/:id without content-type header', async (t) => {
	const response = await server
		.put('/api/v1/tasks/2')
		.unset('Content-Type')
		.send('{"title": "Test"}')
	t.equal(response.status, 415) // Supertest automatically sets content-type when using .send() with JSON
	t.end()
})

tap.test('POST /api/v1/tasks with empty body', async (t) => {
	const response = await server.post('/api/v1/tasks').send({})
	t.equal(response.status, 400)
	t.end()
})

tap.test('POST /api/v1/tasks with missing title', async (t) => {
	const newTask = {
		description: 'Task without title',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('POST /api/v1/tasks with missing description', async (t) => {
	const newTask = {
		title: 'Task without description',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('POST /api/v1/tasks with empty title', async (t) => {
	const newTask = {
		title: '',
		description: 'Task with empty title',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('POST /api/v1/tasks with empty description', async (t) => {
	const newTask = {
		title: 'Task with empty description',
		description: '',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('POST /api/v1/tasks with title too long', async (t) => {
	const newTask = {
		title: 'a'.repeat(201), // 201 characters, exceeds 200 limit
		description: 'Valid description',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('POST /api/v1/tasks with description too long', async (t) => {
	const newTask = {
		title: 'Valid title',
		description: 'a'.repeat(1001), // 1001 characters, exceeds 1000 limit
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('POST /api/v1/tasks with invalid priority', async (t) => {
	const newTask = {
		title: 'Valid title',
		description: 'Valid description',
		priority: 'invalid',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('POST /api/v1/tasks with invalid completed type', async (t) => {
	const newTask = {
		title: 'Valid title',
		description: 'Valid description',
		completed: 'not-boolean',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('POST /api/v1/tasks with valid priority high', async (t) => {
	const newTask = {
		title: 'High Priority Task',
		description: 'This is a high priority task',
		priority: 'high',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 201)
	t.equal(response.body.task.priority, 'high')
	t.end()
})

tap.test('POST /api/v1/tasks with valid priority low', async (t) => {
	const newTask = {
		title: 'Low Priority Task',
		description: 'This is a low priority task',
		priority: 'low',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 201)
	t.equal(response.body.task.priority, 'low')
	t.end()
})

// Test task ID validation edge cases
tap.test('GET /api/v1/tasks/:id with non-numeric id', async (t) => {
	const response = await server.get('/api/v1/tasks/abc')
	t.equal(response.status, 400)
	t.end()
})

tap.test('GET /api/v1/tasks/:id with zero id', async (t) => {
	const response = await server.get('/api/v1/tasks/0')
	t.equal(response.status, 400)
	t.end()
})

tap.test('GET /api/v1/tasks/:id with negative id', async (t) => {
	const response = await server.get('/api/v1/tasks/-1')
	t.equal(response.status, 400)
	t.end()
})

tap.test('PUT /api/v1/tasks/:id with non-numeric id', async (t) => {
	const updatedTask = {
		title: 'Updated Task',
		description: 'Updated Description',
	}
	const response = await server.put('/api/v1/tasks/abc').send(updatedTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('DELETE /api/v1/tasks/:id with non-numeric id', async (t) => {
	const response = await server.delete('/api/v1/tasks/abc')
	t.equal(response.status, 400)
	t.end()
})

// Test update validation edge cases
tap.test('PUT /api/v1/tasks/:id with empty title', async (t) => {
	const updatedTask = {
		title: '',
	}
	const response = await server.put('/api/v1/tasks/2').send(updatedTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('PUT /api/v1/tasks/:id with empty description', async (t) => {
	const updatedTask = {
		description: '',
	}
	const response = await server.put('/api/v1/tasks/2').send(updatedTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('PUT /api/v1/tasks/:id with title too long', async (t) => {
	const updatedTask = {
		title: 'a'.repeat(201),
	}
	const response = await server.put('/api/v1/tasks/2').send(updatedTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('PUT /api/v1/tasks/:id with description too long', async (t) => {
	const updatedTask = {
		description: 'a'.repeat(1001),
	}
	const response = await server.put('/api/v1/tasks/2').send(updatedTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('PUT /api/v1/tasks/:id with invalid priority', async (t) => {
	const updatedTask = {
		title: 'Valid title',
		priority: 'invalid',
	}
	const response = await server.put('/api/v1/tasks/2').send(updatedTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('PUT /api/v1/tasks/:id with invalid completed type', async (t) => {
	const updatedTask = {
		title: 'Valid title',
		completed: 'not-boolean',
	}
	const response = await server.put('/api/v1/tasks/2').send(updatedTask)
	t.equal(response.status, 400)
	t.end()
})

// Test 404 route handler
tap.test('GET /api/v1/nonexistent route', async (t) => {
	const response = await server.get('/api/v1/nonexistent')
	t.equal(response.status, 404)
	t.hasOwnProp(response.body, 'errorMessage')
	t.end()
})

tap.test('POST /api/v1/nonexistent route', async (t) => {
	const response = await server.post('/api/v1/nonexistent').send({})
	t.equal(response.status, 404)
	t.end()
})

// Test content type validation with different content types
tap.test('POST /api/v1/tasks with text/plain content type', async (t) => {
	const response = await server
		.post('/api/v1/tasks')
		.set('Content-Type', 'text/plain')
		.send('plain text data')
	t.equal(response.status, 415)
	t.end()
})

tap.test('PUT /api/v1/tasks/:id with text/plain content type', async (t) => {
	const response = await server
		.put('/api/v1/tasks/2')
		.set('Content-Type', 'text/plain')
		.send('plain text data')
	t.equal(response.status, 415)
	t.end()
})

// Test combined query parameters
tap.test('GET /api/v1/tasks with multiple valid query params', async (t) => {
	const response = await server.get(
		'/api/v1/tasks?completed=false&sortBy=priority&order=desc',
	)
	t.equal(response.status, 200)
	t.equal(response.body.filters.completed, false)
	t.equal(response.body.sorting.sortBy, 'priority')
	t.equal(response.body.sorting.order, 'desc')
	t.end()
})

// Test edge cases for malformed requests
tap.test('POST /api/v1/tasks with malformed JSON', async (t) => {
	const response = await server
		.post('/api/v1/tasks')
		.set('Content-Type', 'application/json')
		.send('{title: "Missing quotes"}') // Invalid JSON
	t.equal(response.status, 400)
	t.end()
})

// Test validation with null values
tap.test('POST /api/v1/tasks with null title', async (t) => {
	const newTask = {
		title: null,
		description: 'Valid description',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('POST /api/v1/tasks with null description', async (t) => {
	const newTask = {
		title: 'Valid title',
		description: null,
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

// Test with numeric values where strings are expected
tap.test('POST /api/v1/tasks with numeric title', async (t) => {
	const newTask = {
		title: 12345,
		description: 'Valid description',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

tap.test('POST /api/v1/tasks with numeric description', async (t) => {
	const newTask = {
		title: 'Valid title',
		description: 12345,
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 400)
	t.end()
})

// Test successful creation with all valid fields
tap.test('POST /api/v1/tasks with all valid fields', async (t) => {
	const newTask = {
		title: 'Complete Valid Task',
		description: 'This is a complete and valid task description',
		completed: true,
		priority: 'high',
	}
	const response = await server.post('/api/v1/tasks').send(newTask)
	t.equal(response.status, 201)
	t.equal(response.body.task.title, 'Complete Valid Task')
	t.equal(response.body.task.completed, true)
	t.equal(response.body.task.priority, 'high')
	t.end()
})

// Test successful update with valid partial data
tap.test('PUT /api/v1/tasks/:id with valid partial update', async (t) => {
	const updatedTask = {
		completed: true,
		priority: 'low',
	}
	const response = await server.put('/api/v1/tasks/2').send(updatedTask)
	t.equal(response.status, 200)
	t.equal(response.body.task.completed, true)
	t.equal(response.body.task.priority, 'low')
	t.end()
})

tap.teardown(() => {
	process.exit(0)
})
