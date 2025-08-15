import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeProduct } from 'test/factories/make-product'
import { FetchProductsUseCase } from './fetch-products'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let productsRepository: InMemoryProductsRepository
let sut: FetchProductsUseCase

describe('Fetch Products Use Case', () => {
	beforeEach(() => {
		productsRepository = new InMemoryProductsRepository()
		sut = new FetchProductsUseCase(productsRepository)
	})

	it('should be able to fetch products', async () => {
		const product = makeProduct()
		productsRepository.items.set(product.id.toValue(), product)

		const product2 = makeProduct()
		productsRepository.items.set(product2.id.toValue(), product2)

		const result = await sut.execute({})

		expect(result.isRight()).toBe(true)
		expect(result.value?.products).toMatchObject([
			{
				id: product.id,
			},
			{
				id: product2.id,
			},
		])
	})

	it('should be able to fetch paginated products', async () => {
		for (let i = 1; i <= 32; i++) {
			const product = makeProduct({}, new UniqueEntityId(`product-${i}`))
			productsRepository.items.set(product.id.toValue(), product)
		}

		const result = await sut.execute({
			page: 2,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.products).toMatchObject([
			{
				id: {
					value: 'product-31',
				},
			},
			{
				id: {
					value: 'product-32',
				},
			},
		])
	})
})
