import { right, type Either } from '@/core/either.ts'
import type { Session, StoreProducts } from '../store/store.ts'

interface GetUserSessionUseCaseRequest {
	// type: 'success' | 'cancelled'
	sessionId: string
}

type GetUserSessionUseCaseResponse = Either<null, { session: Session }>

export class GetUserSessionUseCase {
	constructor(private storeProducts: StoreProducts) {}

	async execute({
		sessionId,
	}: GetUserSessionUseCaseRequest): Promise<GetUserSessionUseCaseResponse> {
		const session = await this.storeProducts.findManyBySessionId(sessionId)
		return right({ session })
	}
}
