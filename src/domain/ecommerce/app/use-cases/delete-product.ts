import { left, right, type Either } from '@/core/either.ts'
import type { ProductsRepository } from '../repositories/products-repository.ts'
import { ResourceAlreadyExistError } from './errors/resource-already-exist.ts'
import { Product } from '../../enterprise/entities/product.ts'
import { Name } from '../../enterprise/entities/value-objects/name.ts'
import { InvalidNameError } from '@/core/errors/domain/invalid-name-error.ts'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'

export interface DeleteProductUseCaseRequest {
	id: string
}

type DeleteProductUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteProductUseCase {
	constructor(private productsRepository: ProductsRepository) {}

	async execute({ id }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
		const product = await this.productsRepository.findById(id)
		if (!product) return left(new ResourceNotFoundError('Product not found.'))

		await this.productsRepository.delete(product)

		return right(null)
	}
}
