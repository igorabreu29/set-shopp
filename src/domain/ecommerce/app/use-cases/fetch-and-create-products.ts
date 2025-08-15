import { left, right, type Either } from '@/core/either'
import { ProductsRepository } from '../repositories/products-repository'
import { StoreProducts } from '../store/store'
import { Product } from '../../enterprise/entities/product'
import { Name } from '../../enterprise/entities/value-objects/name'
import { InvalidNameError } from '@/core/errors/domain/invalid-name-error'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Inject, Injectable } from '@nestjs/common'

type FetchAndCreateProductsUseCaseResponse = Either<InvalidNameError, null>

@Injectable()
export class FetchAndCreateProductsUseCase {
	constructor(
		@Inject(ProductsRepository)
		private productsRepository: ProductsRepository,
		@Inject(StoreProducts)
		private storeProducts: StoreProducts
	) {}

	async execute(): Promise<FetchAndCreateProductsUseCaseResponse> {
		const productsToAdd = await this.storeProducts.findMany()

		const productsOrError = productsToAdd.map(item => {
			const nameOrError = Name.create(item.name)
			if (nameOrError.isLeft()) return new InvalidNameError()

			const productOrError = Product.create(
				{
					name: nameOrError.value,
					description: item.description,
					price: item.price,
					productUrl: item.imageUrl,
					priceId: item.priceId,
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
