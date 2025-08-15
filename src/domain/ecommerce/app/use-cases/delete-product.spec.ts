import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { DeleteProductUseCase } from './delete-product'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { makeProduct } from 'test/factories/make-product'

let productsRepository: InMemoryProductsRepository
let sut: DeleteProductUseCase

describe('Delete Product Use Case', () => {
	beforeEach(() => {
		productsRepository = new InMemoryProductsRepository()
		sut = new DeleteProductUseCase(productsRepository)
	})

	it('should receive instance of "ResourceNotFoundError" if product does not exist', async () => {
		const result = await sut.execute({
			id: 'not-found',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should delete product', async () => {
		const product = makeProduct()
		productsRepository.create(product)

		const result = await sut.execute({
			id: product.id.toValue(),
		})

		expect(result.isRight()).toBe(true)
		expect(productsRepository.items.size).toBe(0)
	})
})
