import { left, right, type Either } from '@/core/either.ts'
import type { ProductsRepository } from '../repositories/products-repository.ts'
import type { StoreProducts } from '../store/store.ts'
import { Product } from '../../enterprise/entities/product.ts'
import { Name } from '../../enterprise/entities/value-objects/name.ts'
import type { InvalidNameError } from '@/core/errors/domain/invalid-name-error.ts'
import { ResourceAlreadyExistError } from './errors/resource-already-exist.ts'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'

interface GetAndCreateProductUseCaseRequest {
	id: string
}

type GetAndCreateProductUseCaseResponse = Either<
	ResourceAlreadyExistError | ResourceNotFoundError | InvalidNameError,
	null
>

export class GetAndCreateProductUseCase {
	constructor(
		private productsRepository: ProductsRepository,
		private storeProducts: StoreProducts
	) {}

	async execute({
		id,
	}: GetAndCreateProductUseCaseRequest): Promise<GetAndCreateProductUseCaseResponse> {
		const productToAdd = await this.storeProducts.getById(id)
		if (!productToAdd) return left(new ResourceNotFoundError('Store Product not found.'))

		const productExist = await this.productsRepository.findByName(productToAdd.name)
		if (productExist) return left(new ResourceAlreadyExistError('Product already exist.'))

		const nameOrError = Name.create(productToAdd.name)
		if (nameOrError.isLeft()) return left(nameOrError.value)

		const productOrError = Product.create({
			name: nameOrError.value,
			description: productToAdd.description,
			price: productToAdd.price,
			productUrl: productToAdd.imageUrl,
		})

		if (productOrError.isLeft()) return left(productOrError.value)

		const product = productOrError.value

		await this.productsRepository.create(product)

		return right(null)
	}
}
