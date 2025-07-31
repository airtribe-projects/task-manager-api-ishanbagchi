const app = require('./app')

const port = process.env.PORT || 3000

app.listen(port, (err) => {
	if (err) {
		return console.log('Something bad happened', err)
	}
	console.log(`Task Manager API is running on port ${port}`)
	console.log(`Available endpoints:`)
	console.log(`  GET    /tasks     - Get all tasks`)
	console.log(`  GET    /tasks/:id - Get task by ID`)
	console.log(`  POST   /tasks     - Create new task`)
	console.log(`  PUT    /tasks/:id - Update task by ID`)
	console.log(`  DELETE /tasks/:id - Delete task by ID`)
})
