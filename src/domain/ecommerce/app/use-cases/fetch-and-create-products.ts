import { left, right, type Either } from '@/core/either.ts'
import type { ProductsRepository } from '../repositories/products-repository.ts'
import type { StoreProducts } from '../store/store.ts'
import { Product } from '../../enterprise/entities/product.ts'
import { Name } from '../../enterprise/entities/value-objects/name.ts'
import { InvalidNameError } from '@/core/errors/domain/invalid-name-error.ts'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'

type FetchAndCreateProductsUseCaseResponse = Either<InvalidNameError, null>

export class FetchAndCreateProductsUseCase {
	constructor(
		private productsRepository: ProductsRepository,
		private storeProducts: StoreProducts
	) {}

	async execute(): Promise<FetchAndCreateProductsUseCaseResponse> {
		const productsToAdd = await this.storeProducts.fetch()

		const productsOrError = productsToAdd.map(item => {
			const nameOrError = Name.create(item.name)
			if (nameOrError.isLeft()) return new InvalidNameError()

			const productOrError = Product.create(
				{
					name: nameOrError.value,
					description: item.description,
					price: item.price,
					productUrl: item.imageUrl,
				},
				new UniqueEntityId(item.id)
			)

			if (productOrError.isLeft()) return productOrError.value
			const product = productOrError.value

			return product
		})

		const someError = productsOrError.find(item => item instanceof InvalidNameError)

		if (someError) return left(new InvalidNameError(someError.message))

		const products = productsOrError as Product[]
		await this.productsRepository.createMany(products)

		return right(null)
	}
}
