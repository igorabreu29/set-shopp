import { right, type Either } from '@/core/either'
import { ProductsRepository } from '../repositories/products-repository.js'
import type { Product } from '../../enterprise/entities/product.ts'
import { Inject, Injectable } from '@nestjs/common'

export interface FetchProductsUseCaseRequest {
	page?: number
}

type FetchProductsUseCaseResponse = Either<
	null,
	{
		products: Product[]
	}
>

@Injectable()
export class FetchProductsUseCase {
	constructor(@Inject(ProductsRepository) private productsRepository: ProductsRepository) {}

	async execute({ page }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
		const products = await this.productsRepository.findMany(page)

		return right({
			products,
		})
	}
}
