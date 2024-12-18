import type { UseCaseError } from '@/core/errors/use-case.ts'

export class ResourceAlreadyExistError extends Error implements UseCaseError {
	constructor(message?: string) {
		super(message ?? 'Resource already exist.')
	}
}
