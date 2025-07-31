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
							task.priority || 'medium', // Default priority if not specified
							task.createdAt || new Date().toISOString(),
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

	getAllTasks(filters = {}, sorting = {}) {
		let filteredTasks = [...this.tasks]

		// Apply filters
		if (filters.completed !== undefined) {
			filteredTasks = filteredTasks.filter(
				(task) => task.completed === filters.completed,
			)
		}

		// Apply sorting
		if (sorting.sortBy) {
			filteredTasks.sort((a, b) => {
				let aValue = a[sorting.sortBy]
				let bValue = b[sorting.sortBy]

				// Handle different data types
				if (sorting.sortBy === 'createdAt') {
					aValue = new Date(aValue)
					bValue = new Date(bValue)
				} else if (sorting.sortBy === 'priority') {
					// Priority order: high > medium > low
					const priorityOrder = { high: 3, medium: 2, low: 1 }
					aValue = priorityOrder[aValue] || 2
					bValue = priorityOrder[bValue] || 2
				} else if (
					typeof aValue === 'string' &&
					typeof bValue === 'string'
				) {
					aValue = aValue.toLowerCase()
					bValue = bValue.toLowerCase()
				}

				if (aValue < bValue) return sorting.order === 'desc' ? 1 : -1
				if (aValue > bValue) return sorting.order === 'desc' ? -1 : 1
				return 0
			})
		} else {
			// Default sort by creation date (newest first)
			filteredTasks.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
			)
		}

		return filteredTasks
	}

	getTasksByPriority(priority) {
		return this.tasks.filter((task) => task.priority === priority)
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
			taskData.priority || 'medium', // Default priority
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
		if (taskData.priority !== undefined) {
			this.tasks[taskIndex].priority = taskData.priority
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
