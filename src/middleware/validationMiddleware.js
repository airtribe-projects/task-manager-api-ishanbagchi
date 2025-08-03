// Import Task model for validation methods
// The Task class provides validate() and validateUpdate() methods
// for validating task data according to business rules
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

	// Check if ID is a string (as expected from URL params)
	if (typeof id !== 'string') {
		return res.status(400).json({
			error: 'Invalid task ID format',
			details:
				'Task ID must be a valid string representation of a number',
		})
	}

	// Check if ID is a valid number
	const taskId = parseInt(id, 10)
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
	if (!body || Object.entries(body).length === 0) {
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
		completed:
			body.completed !== undefined
				? body.completed === true || body.completed === 'true'
				: false, // Default to false if not provided
		priority: body.priority
			? body.priority.toString().toLowerCase()
			: 'medium',
	}

	next()
}

// Middleware to validate request body for updating tasks
const validateUpdateTask = (req, res, next) => {
	const { body } = req

	// Check if request body exists
	if (!body || Object.entries(body).length === 0) {
		return res.status(400).json({
			error: 'Request body is required',
			details:
				'Please provide at least one field to update (title, description, completed, or priority)',
		})
	}

	// Check if at least one valid field is provided
	const allowedFields = ['title', 'description', 'completed', 'priority']
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
		sanitizedBody.completed =
			cleanBody.completed === true || cleanBody.completed === 'true'
	}
	if (cleanBody.priority !== undefined) {
		sanitizedBody.priority = cleanBody.priority.toString().toLowerCase()
	}

	req.body = sanitizedBody
	next()
}

// General input sanitization middleware
const sanitizeInput = (req, res, next) => {
	try {
		// Remove any potentially harmful properties
		if (req.body) {
			delete req.body.id // Don't allow ID to be set via request body
			delete req.body.__proto__
			delete req.body.constructor
		}
		next()
	} catch (error) {
		// Handle any errors during sanitization
		return res.status(500).json({
			errorMessage: 'Input sanitization failed',
			details: 'An error occurred while processing the request data',
		})
	}
}

/**
 * Middleware to validate content type for requests with body data
 *
 * Features:
 * - Only validates content type for HTTP methods that typically send body data (POST, PUT, PATCH)
 * - Accepts application/json and its variants (e.g., with charset=utf-8)
 * - Provides detailed error messages with accepted content types
 * - Returns appropriate HTTP status codes (400 for missing header, 415 for unsupported type)
 * - Skips validation for methods that don't require JSON (GET, DELETE, HEAD, OPTIONS)
 *
 * Error Responses:
 * - 400 Bad Request: When Content-Type header is missing for methods requiring JSON
 * - 415 Unsupported Media Type: When Content-Type is present but not JSON
 *
 * Supported Content Types:
 * - application/json
 * - application/json; charset=utf-8
 * - application/json; charset=UTF-8 (and other charset variants)
 */
const validateContentType = (req, res, next) => {
	// Define methods that typically require JSON content type
	const methodsRequiringJson = ['POST', 'PUT', 'PATCH']

	// Only validate content type for methods that send body data
	if (methodsRequiringJson.includes(req.method)) {
		const contentType = req.get('Content-Type')

		// Handle missing Content-Type header
		if (!contentType) {
			return res.status(400).json({
				error: 'Missing Content-Type header',
				details:
					'Content-Type header is required for this request. Please set it to application/json.',
				acceptedTypes: [
					'application/json',
					'application/json; charset=utf-8',
				],
			})
		}

		// Check for JSON content type, including variants with charset
		// req.is() handles charset variants automatically
		if (!req.is('application/json')) {
			return res.status(415).json({
				error: 'Unsupported Media Type',
				details: `Content-Type '${contentType}' is not supported. This API only accepts JSON data.`,
				acceptedTypes: [
					'application/json',
					'application/json; charset=utf-8',
				],
				receivedType: contentType,
			})
		}
	}

	next()
}

// Middleware to validate priority level parameter
const validatePriorityLevel = (req, res, next) => {
	const { level } = req.params
	const validPriorities = ['low', 'medium', 'high']

	if (!level) {
		return res.status(400).json({
			error: 'Priority level is required',
			details: 'Please provide a valid priority level in the URL',
		})
	}

	if (!validPriorities.includes(level.toLowerCase())) {
		return res.status(400).json({
			error: 'Invalid priority level',
			details: `Priority level must be one of: ${validPriorities.join(
				', ',
			)}`,
		})
	}

	// Add normalized priority to request
	req.priorityLevel = level.toLowerCase()
	next()
}

// Middleware to validate query parameters for filtering and sorting
const validateQueryParams = (req, res, next) => {
	// Ensure req.query is an object before accessing properties
	if (!req.query || typeof req.query !== 'object') {
		return res.status(400).json({
			error: 'Invalid query parameters',
			details: 'Query parameters must be provided as a valid object',
		})
	}

	const { completed, sortBy, order } = req.query

	// Validate completed filter
	if (completed !== undefined) {
		if (!['true', 'false'].includes(completed.toLowerCase())) {
			return res.status(400).json({
				error: 'Invalid completed filter',
				details: 'completed parameter must be "true" or "false"',
			})
		}
		req.query.completed = completed.toLowerCase() == 'true'
	}

	// Validate sortBy parameter
	if (sortBy !== undefined) {
		// Get valid sort fields from Task model to avoid hardcoding
		const validSortFields = Task.getSortableFields
			? Task.getSortableFields()
			: ['createdAt', 'title', 'priority', 'completed']
		if (!validSortFields.includes(sortBy)) {
			return res.status(400).json({
				error: 'Invalid sort field',
				details: `sortBy must be one of: ${validSortFields.join(', ')}`,
			})
		}
	}

	// Validate order parameter
	if (order !== undefined) {
		if (!['asc', 'desc'].includes(order.toLowerCase())) {
			return res.status(400).json({
				error: 'Invalid sort order',
				details: 'order parameter must be "asc" or "desc"',
			})
		}
		req.query.order = order.toLowerCase()
	}

	next()
}

module.exports = {
	validateTaskId,
	validateCreateTask,
	validateUpdateTask,
	validatePriorityLevel,
	validateQueryParams,
	sanitizeInput,
	validateContentType,
}
