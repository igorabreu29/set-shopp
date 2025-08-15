import { Inject } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'
import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface DeleteProductUseCaseRequest {
	id: string
}

type DeleteProductUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteProductUseCase {
	constructor(@Inject(ProductsRepository) private productsRepository: ProductsRepository) {}

	async execute({ id }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
		const product = await this.productsRepository.findById(id)
		if (!product) return left(new ResourceNotFoundError('Product not found.'))

		await this.productsRepository.delete(product)

		return right(null)
	}
}
