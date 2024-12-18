import { left, right, type Either } from '@/core/either.ts'
import type { ProductsRepository } from '../repositories/products-repository.ts'
import { Name } from '../../enterprise/entities/value-objects/name.ts'
import { InvalidNameError } from '@/core/errors/domain/invalid-name-error.ts'
import type { InvalidEmailError } from '@/core/errors/domain/invalid-email-error.ts'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'

export interface EditProductUseCaseRequest {
	id: string
	name?: string
	description?: string
	price?: number
	productUrl?: string
}

type EditProductUseCaseResponse = Either<
	ResourceNotFoundError | InvalidNameError | InvalidEmailError,
	null
>

export class EditProductUseCase {
	constructor(private productsRepository: ProductsRepository) {}

	async execute({
		id,
		name,
		description,
		price,
		productUrl,
	}: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
		const product = await this.productsRepository.findById(id)
		if (!product) return left(new ResourceNotFoundError('Product not found.'))

		const nameOrError = Name.create(name ?? product.name.value)
		if (nameOrError.isLeft()) return left(new InvalidNameError())

		product.name = nameOrError.value
		product.description = description ?? product.description
		product.price = price ?? product.price
		product.productUrl = productUrl ?? product.productUrl

		await this.productsRepository.save(product)

		return right(null)
	}
}
