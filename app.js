const express = require('express')
const routes = require('./src/routes')
const {
	errorHandler,
	notFoundHandler,
} = require('./src/middleware/errorMiddleware')

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
			return console.log('Something bad happened', err)
		}
		console.log(`Server is listening on ${port}`)
	})
}

module.exports = app
