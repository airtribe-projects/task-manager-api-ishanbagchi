const winston = require('winston')
const taskService = require('../services/taskService')

// Winston logger setup for TaskController
const logger = winston.createLogger({
	level: 'error',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.printf(
			({ timestamp, level, message, stack, ...meta }) => {
				const metaStr = Object.keys(meta).length
					? ` ${JSON.stringify(meta)}`
					: ''
				return `[${timestamp}] ${level.toUpperCase()}: ${message}${
					stack ? `\n${stack}` : ''
				}${metaStr}`
			},
		),
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple(),
			),
		}),
		// Uncomment for file logging in production
		// new winston.transports.File({ filename: 'logs/task-controller.log', level: 'error' })
	],
})

class TaskController {
	// GET /tasks - Retrieve all tasks with optional filtering and sorting
	getAllTasks(req, res) {
		try {
			const {
				completed,
				sortBy = 'createdAt',
				order = 'desc',
			} = req.query

			const filters = {}
			if (completed !== undefined) {
				// Only set filters.completed if the value is exactly 'true' or 'false' (case-insensitive)
				if (typeof completed === 'string') {
					if (completed.toLowerCase() === 'true') {
						filters.completed = true
					} else if (completed.toLowerCase() === 'false') {
						filters.completed = false
					}
					// If not 'true' or 'false', do not set filters.completed
				} else if (typeof completed === 'boolean') {
					filters.completed = completed
				}
			}

			const sorting = { sortBy, order }

			const tasks = taskService.getAllTasks(filters, sorting)

			// For backward compatibility: return just tasks array if no query params
			const hasQueryParams = Object.keys(req.query).length > 0

			if (hasQueryParams) {
				res.status(200).json({
					tasks,
					count: tasks.length,
					filters: filters,
					sorting: sorting,
				})
			} else {
				res.status(200).json(tasks)
			}
		} catch (error) {
			logger.error('Error retrieving tasks:', {
				error: error.message,
				stack: error.stack,
				method: 'getAllTasks',
			})
			res.status(500).json({
				error: 'Internal server error',
				details: 'Failed to retrieve tasks',
			})
		}
	}

	// GET /tasks/:id - Retrieve a specific task by ID
	getTaskById(req, res) {
		try {
			const taskId = req.taskId // Use validated ID from middleware
			const task = taskService.getTaskById(taskId)

			if (!task) {
				return res.status(404).json({
					error: 'Task not found',
					details: `No task found with ID: ${taskId}`,
				})
			}

			res.status(200).json(task)
		} catch (error) {
			logger.error('Error retrieving task:', {
				error: error.message,
				stack: error.stack,
				method: 'getTaskById',
				taskId: req.taskId,
			})
			res.status(500).json({
				error: 'Internal server error',
				details: 'Failed to retrieve task',
			})
		}
	}

	// POST /tasks - Create a new task
	createTask(req, res) {
		try {
			const newTask = taskService.createTask(req.body)
			res.status(201).json({
				message: 'Task created successfully',
				task: newTask,
			})
		} catch (error) {
			logger.error('Error creating task:', {
				error: error.message,
				stack: error.stack,
				method: 'createTask',
				taskData: req.body,
			})
			// Data is pre-validated by middleware, any errors here are unexpected service issues
			res.status(500).json({
				error: 'Internal server error',
				details: 'Failed to create task',
			})
		}
	}

	// PUT /tasks/:id - Update an existing task
	updateTask(req, res) {
		try {
			const taskId = req.taskId // Use validated ID from middleware
			const updatedTask = taskService.updateTask(taskId, req.body)

			if (!updatedTask) {
				return res.status(404).json({
					error: 'Task not found',
					details: `No task found with ID: ${taskId}`,
				})
			}

			res.status(200).json({
				message: 'Task updated successfully',
				task: updatedTask,
			})
		} catch (error) {
			logger.error('Error updating task:', {
				error: error.message,
				stack: error.stack,
				method: 'updateTask',
				taskId: req.taskId,
				updateData: req.body,
			})
			// Data is pre-validated by middleware, any errors here are unexpected service issues
			res.status(500).json({
				error: 'Internal server error',
				details: 'Failed to update task',
			})
		}
	}

	// GET /tasks/priority/:level - Retrieve tasks by priority level
	getTasksByPriority(req, res) {
		try {
			const priorityLevel = req.priorityLevel // Use validated priority from middleware
			const tasks = taskService.getTasksByPriority(priorityLevel)

			res.status(200).json({
				tasks,
				count: tasks.length,
				priority: priorityLevel,
			})
		} catch (error) {
			logger.error('Error retrieving tasks by priority:', {
				error: error.message,
				stack: error.stack,
				method: 'getTasksByPriority',
				priorityLevel: req.priorityLevel,
			})
			res.status(500).json({
				error: 'Internal server error',
				details: 'Failed to retrieve tasks by priority',
			})
		}
	}

	// DELETE /tasks/:id - Delete a task
	deleteTask(req, res) {
		try {
			const taskId = req.taskId // Use validated ID from middleware
			const deletedTask = taskService.deleteTask(taskId)

			if (!deletedTask) {
				return res.status(404).json({
					error: 'Task not found',
					details: `No task found with ID: ${taskId}`,
				})
			}

			res.status(200).json({
				message: 'Task deleted successfully',
				task: deletedTask,
			})
		} catch (error) {
			logger.error('Error deleting task:', {
				error: error.message,
				stack: error.stack,
				method: 'deleteTask',
				taskId: req.taskId,
			})
			res.status(500).json({
				error: 'Internal server error',
				details: 'Failed to delete task',
			})
		}
	}
}

module.exports = new TaskController()
