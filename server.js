const winston = require('winston')
const app = require('./app')

const port = process.env.PORT || 3000

// Winston logger setup
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message }) => {
			return `[${timestamp}] ${level.toUpperCase()}: ${message}`
		}),
	),
	transports: [
		new winston.transports.Console(),
		// You can add file or other transports here
	],
})

logger.info('Starting server...')

app.listen(port, (err) => {
	if (err) {
		return logger.error(`Something bad happened: ${err}`)
	}
	logger.info(`Task Manager API is running on port ${port}`)
})
