import { right, type Either } from '@/core/either'
import { type Session, StoreProducts } from '../store/store'
import { Inject, Injectable } from '@nestjs/common'

interface GetUserSessionUseCaseRequest {
	// type: 'success' | 'cancelled'
	sessionId: string
}

type GetUserSessionUseCaseResponse = Either<null, { session: Session }>

@Injectable()
export class GetUserSessionUseCase {
	constructor(@Inject(StoreProducts) private storeProducts: StoreProducts) {}

	async execute({
		sessionId,
	}: GetUserSessionUseCaseRequest): Promise<GetUserSessionUseCaseResponse> {
		const session = await this.storeProducts.findManyBySessionId(sessionId)
		return right({ session })
	}
}
