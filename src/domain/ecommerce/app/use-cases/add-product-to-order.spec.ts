import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository.ts'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository.ts'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository.ts'
import { AddProductToOrderUseCase } from './add-product-to-order.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'
import { makeProduct } from 'test/factories/make-product.ts'
import { makeOrder } from 'test/factories/make-order.ts'
import { makeOrderItem } from 'test/factories/make-order-item.ts'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'

let productsRepository: InMemoryProductsRepository
let ordersRepository: InMemoryOrdersRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let sut: AddProductToOrderUseCase

describe('Add product to cart Use Case', () => {
	beforeEach(() => {
		productsRepository = new InMemoryProductsRepository()
		ordersRepository = new InMemoryOrdersRepository()
		orderItemsRepository = new InMemoryOrderItemsRepository()

		sut = new AddProductToOrderUseCase(productsRepository, ordersRepository, orderItemsRepository)
	})

	it('should receive instance of "ResourceNotFoundError" if product does not exist', async () => {
		const result = await sut.execute({
			customerId: '',
			productId: 'not-found',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should be able to create order', async () => {
		const product = makeProduct()
		productsRepository.items.set(product.id.toValue(), product)

		const result = await sut.execute({
			customerId: 'customer-1',
			productId: product.id.toValue(),
		})

		const order = Array.from(ordersRepository.items.values())
		expect(order).toMatchObject([
			{
				customerId: {
					value: 'customer-1',
				},
			},
		])
	})

	it('should be able to inscrease order item quantity if product already be addedd', async () => {
		const product = makeProduct()
		productsRepository.items.set(product.id.toValue(), product)

		const order = makeOrder({ customerId: new UniqueEntityId('customer-1'), totalPrice: 10 })
		ordersRepository.items.set(order.customerId.toValue(), order)

		const orderItem = makeOrderItem({
			orderId: order.id,
			productId: product.id,
			price: 10,
			quantity: 1,
		})
		orderItemsRepository.items.set(order.id.toValue(), orderItem)

		const result = await sut.execute({
			customerId: 'customer-1',
			productId: product.id.toValue(),
		})

		const orderItemUpdated = Array.from(orderItemsRepository.items.values())[0]
		const orderUpdated = Array.from(ordersRepository.items.values())[0]

		const expected = {
			quantity: 2,
			totalPrice: 20,
		}

		expect(result.isRight()).toBe(true)
		expect(orderItemUpdated.quantity).toEqual(expected.quantity)
		expect(orderUpdated.totalPrice).toEqual(expected.totalPrice)
	})

	it('should be able to create order item', async () => {
		const product = makeProduct({ price: 30 })
		productsRepository.items.set(product.id.toValue(), product)

		const order = makeOrder({ customerId: new UniqueEntityId('customer-1'), totalPrice: 10 })
		ordersRepository.items.set(order.customerId.toValue(), order)

		const result = await sut.execute({
			customerId: 'customer-1',
			productId: product.id.toValue(),
		})

		const orderItem = Array.from(orderItemsRepository.items.values())[0]

		expect(result.isRight()).toBe(true)
		expect(orderItem).toMatchObject({
			orderId: order.id,
			productId: product.id,
			price: product.price,
			quantity: 1,
		})
	})
})
