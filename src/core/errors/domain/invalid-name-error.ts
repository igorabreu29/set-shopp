import type { DomainError } from '../domain'

export class InvalidNameError extends Error implements DomainError {
	constructor(message?: string) {
		super(message ?? 'Invalid name.')
	}
}
