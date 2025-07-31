const taskService = require('../services/taskService')

class TaskController {
	// GET /tasks - Retrieve all tasks
	getAllTasks(req, res) {
		try {
			const tasks = taskService.getAllTasks()
			res.status(200).json(tasks)
		} catch (error) {
			console.error('Error retrieving tasks:', error)
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
			console.error('Error retrieving task:', error)
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
			console.error('Error creating task:', error)
			// Validation errors are handled by middleware, so this is likely a service error
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
			console.error('Error updating task:', error)
			// Validation errors are handled by middleware, so this is likely a service error
			res.status(500).json({
				error: 'Internal server error',
				details: 'Failed to update task',
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
			console.error('Error deleting task:', error)
			res.status(500).json({
				error: 'Internal server error',
				details: 'Failed to delete task',
			})
		}
	}
}

module.exports = new TaskController()
