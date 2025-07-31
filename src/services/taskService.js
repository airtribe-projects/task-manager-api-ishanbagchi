const fs = require('fs')
const path = require('path')
const Task = require('../models/Task')

class TaskService {
	constructor() {
		this.tasks = []
		this.nextId = 1
		this.loadInitialData()
	}

	loadInitialData() {
		try {
			const dataPath = path.join(__dirname, '../../task.json')
			const data = fs.readFileSync(dataPath, 'utf8')
			const jsonData = JSON.parse(data)

			if (jsonData.tasks && Array.isArray(jsonData.tasks)) {
				this.tasks = jsonData.tasks.map(
					(task) =>
						new Task(
							task.id,
							task.title,
							task.description,
							task.completed,
						),
				)

				// Set nextId to be one more than the highest existing ID
				if (this.tasks.length > 0) {
					this.nextId =
						Math.max(...this.tasks.map((task) => task.id)) + 1
				}
			}
		} catch (error) {
			console.log(
				'No initial data file found or error reading it, starting with empty tasks array',
			)
			this.tasks = []
			this.nextId = 1
		}
	}

	getAllTasks() {
		return this.tasks
	}

	getTaskById(id) {
		// ID is already validated as integer by middleware
		return this.tasks.find((task) => task.id === id)
	}

	createTask(taskData) {
		// Validation is handled by middleware, but keep this as backup
		const validation = Task.validate(taskData)
		if (!validation.isValid) {
			throw new Error(validation.errors.join(', '))
		}

		const newTask = new Task(
			this.nextId++,
			taskData.title, // Already sanitized by middleware
			taskData.description, // Already sanitized by middleware
			taskData.completed || false,
		)

		this.tasks.push(newTask)
		return newTask
	}

	updateTask(id, taskData) {
		// ID is already validated as integer by middleware
		const taskIndex = this.tasks.findIndex((task) => task.id === id)

		if (taskIndex === -1) {
			return null
		}

		// Validation is handled by middleware, but keep this as backup
		const validation = Task.validateUpdate(taskData)
		if (!validation.isValid) {
			throw new Error(validation.errors.join(', '))
		}

		// Update only provided fields (data is already sanitized by middleware)
		if (taskData.title !== undefined) {
			this.tasks[taskIndex].title = taskData.title
		}
		if (taskData.description !== undefined) {
			this.tasks[taskIndex].description = taskData.description
		}
		if (taskData.completed !== undefined) {
			this.tasks[taskIndex].completed = taskData.completed
		}

		return this.tasks[taskIndex]
	}

	deleteTask(id) {
		// ID is already validated as integer by middleware
		const taskIndex = this.tasks.findIndex((task) => task.id === id)

		if (taskIndex === -1) {
			return null
		}

		const deletedTask = this.tasks[taskIndex]
		this.tasks.splice(taskIndex, 1)
		return deletedTask
	}
}

module.exports = new TaskService()
