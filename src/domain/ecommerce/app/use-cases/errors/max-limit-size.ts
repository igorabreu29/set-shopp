import type { UseCaseError } from '@/core/errors/use-case.ts'

export class MaxLimitSizeError extends Error implements UseCaseError {
	constructor(message?: string) {
		super(message ?? 'Max Limit Size.')
	}
}
