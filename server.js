const app = require('./app')

const port = process.env.PORT || 3000

console.log('Starting server...')

app.listen(port, (err) => {
	if (err) {
		return console.log('Something bad happened', err)
	}
	console.log(`Task Manager API is running on port ${port}`)
	console.log(`Available endpoints:`)
	console.log(
		`  GET    /tasks                    - Get all tasks (supports filtering & sorting)`,
	)
	console.log(`  GET    /tasks/:id                - Get task by ID`)
	console.log(
		`  GET    /tasks/priority/:level    - Get tasks by priority (low/medium/high)`,
	)
	console.log(
		`  POST   /tasks                    - Create new task (supports priority)`,
	)
	console.log(
		`  PUT    /tasks/:id                - Update task by ID (supports priority)`,
	)
	console.log(`  DELETE /tasks/:id                - Delete task by ID`)
	console.log(`\n  Query parameters for GET /tasks:`)
	console.log(
		`    ?completed=true/false          - Filter by completion status`,
	)
	console.log(
		`    ?sortBy=field&order=asc/desc   - Sort by createdAt/title/priority/completed`,
	)
})
