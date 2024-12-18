import { left, right, type Either } from '@/core/either.ts'
import type { ProductsRepository } from '../repositories/products-repository.ts'
import type { Product } from '../../enterprise/entities/product.ts'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'

export interface GetProductUseCaseRequest {
	id: string
}

type GetProductUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		product: Product
	}
>

export class GetProductUseCase {
	constructor(private productsRepository: ProductsRepository) {}

	async execute({ id }: GetProductUseCaseRequest): Promise<GetProductUseCaseResponse> {
		const product = await this.productsRepository.findById(id)
		if (!product) return left(new ResourceNotFoundError('Product not found.'))

		return right({
			product,
		})
	}
}
