import type { DomainError } from '../domain'

export class InvalidEmailError extends Error implements DomainError {
	constructor(message?: string) {
		super(message ?? 'Invalid email.')
	}
}
