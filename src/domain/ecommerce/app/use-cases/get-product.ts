import { left, right, type Either } from '@/core/either'
import { ProductsRepository } from '../repositories/products-repository'
import type { Product } from '../../enterprise/entities/product'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { Inject, Injectable } from '@nestjs/common'

export interface GetProductUseCaseRequest {
	id: string
}

type GetProductUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		product: Product
	}
>

@Injectable()
export class GetProductUseCase {
	constructor(@Inject(ProductsRepository) private productsRepository: ProductsRepository) {}

	async execute({ id }: GetProductUseCaseRequest): Promise<GetProductUseCaseResponse> {
		const product = await this.productsRepository.findById(id)
		if (!product) return left(new ResourceNotFoundError('Product not found.'))

		return right({
			product,
		})
	}
}
