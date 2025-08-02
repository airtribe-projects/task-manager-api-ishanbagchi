const express = require('express')
const winston = require('winston')
const routes = require('./src/routes')
const {
	errorHandler,
	notFoundHandler,
} = require('./src/middleware/errorMiddleware')

// Simple winston logger for app.js fallback scenarios
const logger = winston.createLogger({
	level: 'error',
	format: winston.format.simple(),
	transports: [new winston.transports.Console()],
})

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/', routes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server only if this file is run directly
if (require.main === module) {
	app.listen(port, (err) => {
		if (err) {
			return logger.error('Failed to start server:', err)
		}
		logger.info(`Server is listening on port ${port}`)
	})
}

module.exports = app
