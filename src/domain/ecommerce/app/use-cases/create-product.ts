import { right, type Either } from '@/core/either.ts'
import type { ResourceAlreadyExistError } from './errors/resource-already-exist.ts'
import type { InvalidNameError } from '@/core/errors/domain/invalid-name-error.ts'
import type { InvalidEmailError } from '@/core/errors/domain/invalid-email-error.ts'
import type { StoreProduct, StoreProducts } from '../store/store.ts'

export interface CreateProductUseCaseRequest {
	name: string
	description: string
	price: number
	productUrl: string
}

type CreateProductUseCaseResponse = Either<
	ResourceAlreadyExistError | InvalidNameError | InvalidEmailError,
	null
>

export class CreateProductUseCase {
	constructor(private storeProducts: StoreProducts) {}

	async execute({
		name,
		description,
		price,
		productUrl,
	}: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
		const product: Omit<StoreProduct, 'id'> = {
			name,
			description,
			price,
			imageUrl: productUrl,
		}

		await this.storeProducts.create(product)

		return right(null)
	}
}
