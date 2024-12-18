import { beforeEach, describe, expect, it } from 'vitest'
import { CreateProductUseCase } from './create-product.ts'
import { FakeStoreProduct } from 'test/store/fake-store.ts'

let storeProducts: FakeStoreProduct
let sut: CreateProductUseCase

describe('Create Product Use Case', () => {
	beforeEach(() => {
		storeProducts = new FakeStoreProduct()
		sut = new CreateProductUseCase(storeProducts)
	})

	it('should be able to create product', async () => {
		const result = await sut.execute({
			name: 'product-1',
			description: 'ramdom',
			price: 20,
			productUrl: '',
		})

		expect(result.isRight()).toBe(true)
		expect(storeProducts.items.size).toEqual(1)
	})
})
