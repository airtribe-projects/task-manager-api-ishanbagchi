const express = require('express')
const router = express.Router()
const taskRoutes = require('./taskRoutes')

// Mount task routes
router.use('/tasks', taskRoutes)

module.exports = router
