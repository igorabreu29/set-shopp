import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { EditProductUseCase } from './edit-product.ts'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'
import { makeProduct } from 'test/factories/make-product.ts'

let productsRepository: InMemoryProductsRepository
let sut: EditProductUseCase

describe('Edit Product Use Case', () => {
	beforeEach(() => {
		productsRepository = new InMemoryProductsRepository()
		sut = new EditProductUseCase(productsRepository)
	})

	it('should receive instance of "Resource Not Found Error" if product not found', async () => {
		const result = await sut.execute({
			id: 'not-found',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should be able to edit product', async () => {
		const product = makeProduct()
		productsRepository.items.set(product.id.toValue(), product)

		const result = await sut.execute({
			id: product.id.toValue(),
			name: 'product-edited',
		})

		const productEdited = productsRepository.items.get(product.id.toValue())

		expect(result.isRight()).toBe(true)
		expect(productEdited).toMatchObject({
			name: {
				value: 'product-edited',
			},
		})
	})
})
