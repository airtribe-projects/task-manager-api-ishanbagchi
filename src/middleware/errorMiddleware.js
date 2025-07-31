// Error handling middleware
const errorHandler = (err, req, res, next) => {
	console.error('Error occurred:', {
		message: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
	})

	// Default error response
	let status = 500
	let message = 'Internal Server Error'
	let details = 'An unexpected error occurred'

	// Handle specific error types
	if (err.name === 'ValidationError') {
		status = 400
		message = 'Validation Error'
		details = err.message
	} else if (err.name === 'NotFoundError') {
		status = 404
		message = 'Not Found'
		details = err.message
	} else if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
		status = 400
		message = 'Invalid JSON'
		details = 'Request body contains invalid JSON'
	} else if (err.code === 'ENOTFOUND') {
		status = 503
		message = 'Service Unavailable'
		details = 'External service not available'
	}

	const errorResponse = {
		error: message,
		details,
		timestamp: new Date().toISOString(),
		path: req.url,
	}

	// Include stack trace in development mode
	if (process.env.NODE_ENV === 'development') {
		errorResponse.stack = err.stack
	}

	res.status(status).json(errorResponse)
}

// 404 handler for undefined routes
const notFoundHandler = (req, res) => {
	res.status(404).json({
		error: 'Route not found',
		details: `The requested endpoint ${req.method} ${req.url} does not exist`,
		timestamp: new Date().toISOString(),
		availableEndpoints: {
			tasks: {
				'GET /tasks': 'Get all tasks',
				'GET /tasks/:id': 'Get task by ID',
				'POST /tasks': 'Create new task',
				'PUT /tasks/:id': 'Update task by ID',
				'DELETE /tasks/:id': 'Delete task by ID',
			},
		},
	})
}

module.exports = {
	errorHandler,
	notFoundHandler,
}
