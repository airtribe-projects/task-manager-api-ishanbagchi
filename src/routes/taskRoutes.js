const express = require('express')
const router = express.Router()
const taskController = require('../controllers/taskController')
const {
	validateTaskId,
	validateCreateTask,
	validateUpdateTask,
	validatePriorityLevel,
	validateQueryParams,
	sanitizeInput,
	validateContentType,
} = require('../middleware/validationMiddleware')

// Apply general middleware to all routes
router.use(sanitizeInput)
router.use(validateContentType)

// GET /tasks - Retrieve all tasks with optional filtering and sorting
router.get(
	'/',
	validateQueryParams,
	taskController.getAllTasks.bind(taskController),
)

// GET /tasks/priority/:level - Retrieve tasks by priority level
router.get(
	'/priority/:level',
	validatePriorityLevel,
	taskController.getTasksByPriority.bind(taskController),
)

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
