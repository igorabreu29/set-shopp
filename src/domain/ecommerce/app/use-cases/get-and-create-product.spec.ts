import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository.ts'
import { FakeStoreProduct } from 'test/store/fake-store.ts'
import { GetAndCreateProductUseCase } from './get-and-create-product.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'
import { makeProduct } from 'test/factories/make-product.ts'
import { makeName } from 'test/factories/make-name.ts'
import { ResourceAlreadyExistError } from './errors/resource-already-exist.ts'

let storeProducts: FakeStoreProduct
let productsRepository: InMemoryProductsRepository
let sut: GetAndCreateProductUseCase

describe('Get And Create Product Use Case', () => {
	beforeEach(() => {
		storeProducts = new FakeStoreProduct()
		productsRepository = new InMemoryProductsRepository()
		sut = new GetAndCreateProductUseCase(productsRepository, storeProducts)
	})

	it('should not be able to create product if store product does not exist', async () => {
		const result = await sut.execute({
			id: 'not-found',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not be able to create existing product', async () => {
		const storeProduct = {
			id: 'product_test',
			name: 'Coffee',
			description: 'Delicous black coffee',
			price: 3.0,
		}
		storeProducts.create(storeProduct)

		const name = makeName('Coffee')
		const product = makeProduct({ name })
		productsRepository.items.set(product.name.value, product)

		const result = await sut.execute({
			id: 'product_test',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceAlreadyExistError)
	})

	it('should be able to create product', async () => {
		const storeProduct = {
			id: 'product_test',
			name: 'Coffee',
			description: 'Delicous black coffee',
			price: 3.0,
		}
		storeProducts.create(storeProduct)

		const result = await sut.execute({
			id: 'product_test',
		})

		expect(result.isRight()).toBe(true)
		expect(productsRepository.items.size).toEqual(1)
		expect(productsRepository.items.values().next().value).toMatchObject({
			name: {
				value: 'Coffee',
			},
		})
	})
})
