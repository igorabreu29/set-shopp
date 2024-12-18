import type { UseCaseError } from '@/core/errors/use-case.ts'

export class ResourceNotFoundError extends Error implements UseCaseError {
	constructor(message?: string) {
		super(message ?? 'Resource Not Found.')
	}
}
