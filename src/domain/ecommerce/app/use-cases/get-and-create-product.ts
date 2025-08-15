import { left, right, type Either } from '@/core/either'
import { ProductsRepository } from '../repositories/products-repository'
import { StoreProducts } from '../store/store'
import { Product } from '../../enterprise/entities/product'
import { Name } from '../../enterprise/entities/value-objects/name'
import type { InvalidNameError } from '@/core/errors/domain/invalid-name-error'
import { ResourceAlreadyExistError } from './errors/resource-already-exist'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { Inject, Injectable } from '@nestjs/common'

interface GetAndCreateProductUseCaseRequest {
	id: string
}

type GetAndCreateProductUseCaseResponse = Either<
	ResourceAlreadyExistError | ResourceNotFoundError | InvalidNameError,
	null
>

@Injectable()
export class GetAndCreateProductUseCase {
	constructor(
		@Inject(ProductsRepository)
		private productsRepository: ProductsRepository,
		@Inject(StoreProducts)
		private storeProducts: StoreProducts
	) {}

	async execute({
		id,
	}: GetAndCreateProductUseCaseRequest): Promise<GetAndCreateProductUseCaseResponse> {
		const productToAdd = await this.storeProducts.findById(id)
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
			priceId: productToAdd.priceId,
		})

		if (productOrError.isLeft()) return left(productOrError.value)

		const product = productOrError.value

		await this.productsRepository.create(product)

		return right(null)
	}
}
