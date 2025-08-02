const winston = require('winston')

// Winston logger setup for error handling
const logger = winston.createLogger({
	level: 'error',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.json(),
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple(),
			),
		}),
		// You can add file transport for error logs
		// new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
	],
})

// Error handling middleware
const errorHandler = (err, req, res, next) => {
	logger.error('Error occurred:', {
		message: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
		timestamp: new Date().toISOString(),
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
	}

	const errorResponse = {
		errorMessage: message,
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
		errorMessage: 'Route not found',
		details: `The requested endpoint ${req.method} ${req.url} does not exist`,
		timestamp: new Date().toISOString(),
		suggestion:
			'Please check the API documentation for available endpoints',
	})
}

module.exports = {
	errorHandler,
	notFoundHandler,
}
