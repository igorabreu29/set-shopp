import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { FakeStoreProduct } from 'test/store/fake-store'
import { FetchAndCreateProductsUseCase } from './fetch-and-create-products'
import { beforeEach, describe, expect, it } from 'vitest'

let productsRepository: InMemoryProductsRepository
let fakeStoreProduct: FakeStoreProduct
let sut: FetchAndCreateProductsUseCase

describe('Fetch and Create Products Use Case', () => {
	beforeEach(() => {
		productsRepository = new InMemoryProductsRepository()
		fakeStoreProduct = new FakeStoreProduct()
		sut = new FetchAndCreateProductsUseCase(productsRepository, fakeStoreProduct)
	})

	it('should be able to fetch and create products', async () => {
		const result = await sut.execute()

		expect(result.isRight()).toBe(true)
		expect(productsRepository.items.size).toBe(2)
	})
})
