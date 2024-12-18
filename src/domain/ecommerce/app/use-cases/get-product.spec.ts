import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeProduct } from 'test/factories/make-product.ts'
import { GetProductUseCase } from './get-product.ts'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'

let productsRepository: InMemoryProductsRepository
let sut: GetProductUseCase

describe('Get Product Use Case', () => {
	beforeEach(() => {
		productsRepository = new InMemoryProductsRepository()
		sut = new GetProductUseCase(productsRepository)
	})

	it('should receive instance of "ResourceNotFoundError" if product does not exist', async () => {
		const result = await sut.execute({
			id: 'not-found',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should be able to get product', async () => {
		const product = makeProduct()
		productsRepository.items.set(product.id.toValue(), product)

		const result = await sut.execute({
			id: product.id.toValue(),
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			product: {
				id: product.id,
			},
		})
	})
})
