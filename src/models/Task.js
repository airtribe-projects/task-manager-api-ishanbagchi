class Task {
	constructor(
		id,
		title,
		description = '',
		completed = false,
		priority = 'medium',
		createdAt = new Date().toISOString(),
	) {
		this.id = id
		this.title = title
		this.description = description
		this.completed = completed
		this.priority = priority
		this.createdAt = createdAt
	}

	// Helper validation methods
	static validateTitle(title, isRequired = true) {
		const errors = []

		if (isRequired && !title) {
			errors.push('Title is required')
		} else if (title !== undefined) {
			if (typeof title !== 'string') {
				errors.push('Title must be a string')
			} else if (title.trim() === '') {
				errors.push('Title cannot be empty or contain only whitespace')
			} else if (title.trim().length > 200) {
				errors.push('Title cannot exceed 200 characters')
			}
		}

		return errors
	}

	static validateDescription(description, isRequired = true) {
		const errors = []

		if (isRequired && !description) {
			errors.push('Description is required')
		} else if (description !== undefined) {
			if (typeof description !== 'string') {
				errors.push('Description must be a string')
			} else if (description.trim() === '') {
				errors.push(
					'Description cannot be empty or contain only whitespace',
				)
			} else if (description.trim().length > 1000) {
				errors.push('Description cannot exceed 1000 characters')
			}
		}

		return errors
	}

	static validateCompleted(completed) {
		const errors = []

		if (completed !== undefined && typeof completed !== 'boolean') {
			errors.push('Completed must be a boolean value (true or false)')
		}

		return errors
	}

	static validatePriority(priority) {
		const errors = []

		if (priority !== undefined) {
			const validPriorities = ['low', 'medium', 'high']
			if (typeof priority !== 'string') {
				errors.push('Priority must be a string')
			} else if (!validPriorities.includes(priority.toLowerCase())) {
				errors.push('Priority must be one of: low, medium, high')
			}
		}

		return errors
	}

	static validate(taskData) {
		const errors = [
			...this.validateTitle(taskData.title, true),
			...this.validateDescription(taskData.description, true),
			...this.validateCompleted(taskData.completed),
			...this.validatePriority(taskData.priority),
		]

		return {
			isValid: errors.length === 0,
			errors,
		}
	}

	static validateUpdate(taskData) {
		const errors = [
			...this.validateTitle(taskData.title, false),
			...this.validateDescription(taskData.description, false),
			...this.validateCompleted(taskData.completed),
			...this.validatePriority(taskData.priority),
		]

		return {
			isValid: errors.length === 0,
			errors,
		}
	}

	// Get sortable fields for query parameter validation
	static getSortableFields() {
		return ['createdAt', 'title', 'priority', 'completed']
	}
}

module.exports = Task
