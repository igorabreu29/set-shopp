import { right, type Either } from '@/core/either'
import { Inject } from '@nestjs/common'
import { StoreProducts } from '../store/store'

interface CreateStoreProductUseCaseRequest {
	name: string
	description: string
	price: number
	imageUrl?: string
}

type CreateStoreProductUseCaseResponse = Either<null, null>

export class CreateStoreProductUseCase {
	constructor(@Inject(StoreProducts) private storeProducts: StoreProducts) {}

	async execute({
		name,
		description,
		price,
		imageUrl,
	}: CreateStoreProductUseCaseRequest): Promise<CreateStoreProductUseCaseResponse> {
		const priceInCents = price * 100

		await this.storeProducts.create({
			name,
			description,
			price: priceInCents,
			imageUrl,
		})

		return right(null)
	}
}
