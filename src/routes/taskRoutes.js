const express = require('express')
const router = express.Router()
const taskController = require('../controllers/taskController')
const {
	validateTaskId,
	validateCreateTask,
	validateUpdateTask,
	sanitizeInput,
	validateContentType,
} = require('../middleware/validationMiddleware')

// Apply general middleware to all routes
router.use(sanitizeInput)
router.use(validateContentType)

// GET /tasks - Retrieve all tasks
router.get('/', taskController.getAllTasks.bind(taskController))

// GET /tasks/:id - Retrieve a specific task by ID
router.get(
	'/:id',
	validateTaskId,
	taskController.getTaskById.bind(taskController),
)

// POST /tasks - Create a new task
router.post(
	'/',
	validateCreateTask,
	taskController.createTask.bind(taskController),
)

// PUT /tasks/:id - Update an existing task
router.put(
	'/:id',
	validateTaskId,
	validateUpdateTask,
	taskController.updateTask.bind(taskController),
)

// DELETE /tasks/:id - Delete a task
router.delete(
	'/:id',
	validateTaskId,
	taskController.deleteTask.bind(taskController),
)

module.exports = router
