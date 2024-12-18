import { right, type Either } from '@/core/either.ts'
import type { ProductsRepository } from '../repositories/products-repository.ts'
import type { Product } from '../../enterprise/entities/product.ts'

export interface FetchProductsUseCaseRequest {
	page?: number
}

type FetchProductsUseCaseResponse = Either<
	null,
	{
		products: Product[]
	}
>

export class FetchProductsUseCase {
	constructor(private productsRepository: ProductsRepository) {}

	async execute({ page }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
		const products = await this.productsRepository.findMany(page)

		return right({
			products,
		})
	}
}
