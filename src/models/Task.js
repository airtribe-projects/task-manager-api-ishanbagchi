class Task {
	constructor(
		id,
		title,
		description,
		completed = false,
		priority = 'medium',
		createdAt = null,
	) {
		this.id = id
		this.title = title
		this.description = description
		this.completed = completed
		this.priority = priority
		this.createdAt = createdAt || new Date().toISOString()
	}

	static validate(taskData) {
		const errors = []

		// Validate title
		if (!taskData.title) {
			errors.push('Title is required')
		} else if (typeof taskData.title !== 'string') {
			errors.push('Title must be a string')
		} else if (taskData.title.trim() === '') {
			errors.push('Title cannot be empty or contain only whitespace')
		} else if (taskData.title.trim().length > 200) {
			errors.push('Title cannot exceed 200 characters')
		}

		// Validate description
		if (!taskData.description) {
			errors.push('Description is required')
		} else if (typeof taskData.description !== 'string') {
			errors.push('Description must be a string')
		} else if (taskData.description.trim() === '') {
			errors.push(
				'Description cannot be empty or contain only whitespace',
			)
		} else if (taskData.description.trim().length > 1000) {
			errors.push('Description cannot exceed 1000 characters')
		}

		// Validate completed status
		if (taskData.completed !== undefined) {
			if (typeof taskData.completed !== 'boolean') {
				errors.push('Completed must be a boolean value (true or false)')
			}
		}

		// Validate priority
		if (taskData.priority !== undefined) {
			const validPriorities = ['low', 'medium', 'high']
			if (typeof taskData.priority !== 'string') {
				errors.push('Priority must be a string')
			} else if (
				!validPriorities.includes(taskData.priority.toLowerCase())
			) {
				errors.push('Priority must be one of: low, medium, high')
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		}
	}

	static validateUpdate(taskData) {
		const errors = []

		// Validate title (if provided)
		if (taskData.title !== undefined) {
			if (typeof taskData.title !== 'string') {
				errors.push('Title must be a string')
			} else if (taskData.title.trim() === '') {
				errors.push('Title cannot be empty or contain only whitespace')
			} else if (taskData.title.trim().length > 200) {
				errors.push('Title cannot exceed 200 characters')
			}
		}

		// Validate description (if provided)
		if (taskData.description !== undefined) {
			if (typeof taskData.description !== 'string') {
				errors.push('Description must be a string')
			} else if (taskData.description.trim() === '') {
				errors.push(
					'Description cannot be empty or contain only whitespace',
				)
			} else if (taskData.description.trim().length > 1000) {
				errors.push('Description cannot exceed 1000 characters')
			}
		}

		// Validate completed status (if provided)
		if (taskData.completed !== undefined) {
			if (typeof taskData.completed !== 'boolean') {
				errors.push('Completed must be a boolean value (true or false)')
			}
		}

		// Validate priority (if provided)
		if (taskData.priority !== undefined) {
			const validPriorities = ['low', 'medium', 'high']
			if (typeof taskData.priority !== 'string') {
				errors.push('Priority must be a string')
			} else if (
				!validPriorities.includes(taskData.priority.toLowerCase())
			) {
				errors.push('Priority must be one of: low, medium, high')
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		}
	}
}

module.exports = Task
