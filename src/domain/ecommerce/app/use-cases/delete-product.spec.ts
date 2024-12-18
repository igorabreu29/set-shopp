import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeProduct } from 'test/factories/make-product.ts'
import { ResourceAlreadyExistError } from './errors/resource-already-exist.ts'
import { DeleteProductUseCase } from './delete-product.ts'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'

let productsRepository: InMemoryProductsRepository
let sut: DeleteProductUseCase

describe('Delete Product Use Case', () => {
	beforeEach(() => {
		productsRepository = new InMemoryProductsRepository()
		sut = new DeleteProductUseCase(productsRepository)
	})

	it('should receive instance of "Resource Not Found Error" if product not found', async () => {
		const result = await sut.execute({
			id: 'not-found',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should be able to delete product', async () => {
		const product = makeProduct()
		productsRepository.create(product)

		const result = await sut.execute({
			id: product.id.toValue(),
		})

		expect(result.isRight()).toBe(true)
		expect(productsRepository.items).toHaveLength(0)
	})
})
