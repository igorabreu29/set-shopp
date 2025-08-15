import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FakeStoreProduct } from 'test/store/fake-store'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository'
import { CheckoutOrderUseCase } from './checkout-order'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { makeOrder } from 'test/factories/make-order'
import { makeOrderItem } from 'test/factories/make-order-item'

let ordersRepository: InMemoryOrdersRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let storeProducts: FakeStoreProduct

let sut: CheckoutOrderUseCase

describe('Checkout Order Use Case', () => {
	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository()
		orderItemsRepository = new InMemoryOrderItemsRepository()
		storeProducts = new FakeStoreProduct()

		sut = new CheckoutOrderUseCase(ordersRepository, orderItemsRepository, storeProducts)
	})

	it('should receive instance of "ResourceNotFoundError" if order does not exist', async () => {
		const result = await sut.execute({
			orderId: 'not-found',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should receive checkoutUrl if checkout to be completed', async () => {
		const order = makeOrder()
		ordersRepository.create(order)

		const orderItem = makeOrderItem({ orderId: order.id })
		const orderItem2 = makeOrderItem({ orderId: order.id })

		orderItemsRepository.items.set(order.id.toValue(), orderItem)
		orderItemsRepository.items.set(order.id.toValue(), orderItem2)

		const result = await sut.execute({
			orderId: order.id.toValue(),
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			checkoutUrl: 'fake-url',
		})
	})
})
