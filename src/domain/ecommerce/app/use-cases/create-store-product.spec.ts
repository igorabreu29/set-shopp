import { FakeStoreProduct } from 'test/store/fake-store'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateStoreProductUseCase } from './create-store-product'

let storeProducts: FakeStoreProduct
let sut: CreateStoreProductUseCase

describe('Create Store Product Use Case', async () => {
	beforeEach(() => {
		storeProducts = new FakeStoreProduct()
		sut = new CreateStoreProductUseCase(storeProducts)
	})

	it('should create a product', async () => {
		const result = await sut.execute({
			name: 'test',
			description: 'test',
			price: 10,
			imageUrl: '',
		})

		expect(result.isRight()).toBe(true)
		expect(storeProducts.items.size).toBe(1)
	})
})
