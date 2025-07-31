const Task = require('../models/Task')

// Middleware to validate task ID parameter
const validateTaskId = (req, res, next) => {
	const { id } = req.params

	// Check if ID is provided
	if (!id) {
		return res.status(400).json({
			error: 'Task ID is required',
			details: 'Please provide a valid task ID in the URL',
		})
	}

	// Check if ID is a valid number
	const taskId = parseInt(id)
	if (isNaN(taskId) || taskId <= 0) {
		return res.status(400).json({
			error: 'Invalid task ID',
			details: 'Task ID must be a positive integer',
		})
	}

	// Add parsed ID to request for use in controller
	req.taskId = taskId
	next()
}

// Middleware to validate request body for creating tasks
const validateCreateTask = (req, res, next) => {
	const { body } = req

	// Check if request body exists
	if (!body || Object.keys(body).length === 0) {
		return res.status(400).json({
			error: 'Request body is required',
			details: 'Please provide task data in the request body',
		})
	}

	// Validate using Task model
	const validation = Task.validate(body)

	if (!validation.isValid) {
		return res.status(400).json({
			error: 'Validation failed',
			details: validation.errors,
		})
	}

	// Sanitize input
	req.body = {
		title: body.title?.toString().trim(),
		description: body.description?.toString().trim(),
		completed: Boolean(body.completed),
	}

	next()
}

// Middleware to validate request body for updating tasks
const validateUpdateTask = (req, res, next) => {
	const { body } = req

	// Check if request body exists
	if (!body || Object.keys(body).length === 0) {
		return res.status(400).json({
			error: 'Request body is required',
			details:
				'Please provide at least one field to update (title, description, or completed)',
		})
	}

	// Check if at least one valid field is provided
	const allowedFields = ['title', 'description', 'completed']
	const providedFields = Object.keys(body)
	const validFields = providedFields.filter((field) =>
		allowedFields.includes(field),
	)

	if (validFields.length === 0) {
		return res.status(400).json({
			error: 'No valid fields provided',
			details: `Allowed fields are: ${allowedFields.join(', ')}`,
		})
	}

	// Remove invalid fields
	const cleanBody = {}
	validFields.forEach((field) => {
		cleanBody[field] = body[field]
	})

	// Validate using Task model
	const validation = Task.validateUpdate(cleanBody)

	if (!validation.isValid) {
		return res.status(400).json({
			error: 'Validation failed',
			details: validation.errors,
		})
	}

	// Sanitize input
	const sanitizedBody = {}
	if (cleanBody.title !== undefined) {
		sanitizedBody.title = cleanBody.title.toString().trim()
	}
	if (cleanBody.description !== undefined) {
		sanitizedBody.description = cleanBody.description.toString().trim()
	}
	if (cleanBody.completed !== undefined) {
		sanitizedBody.completed = Boolean(cleanBody.completed)
	}

	req.body = sanitizedBody
	next()
}

// General input sanitization middleware
const sanitizeInput = (req, res, next) => {
	// Remove any potentially harmful properties
	if (req.body) {
		delete req.body.id // Don't allow ID to be set via request body
		delete req.body.__proto__
		delete req.body.constructor
	}
	next()
}

// Middleware to validate JSON content type for POST/PUT requests
const validateContentType = (req, res, next) => {
	if (['POST', 'PUT'].includes(req.method)) {
		if (!req.is('application/json')) {
			return res.status(400).json({
				error: 'Invalid content type',
				details: 'Content-Type must be application/json',
			})
		}
	}
	next()
}

module.exports = {
	validateTaskId,
	validateCreateTask,
	validateUpdateTask,
	sanitizeInput,
	validateContentType,
}
