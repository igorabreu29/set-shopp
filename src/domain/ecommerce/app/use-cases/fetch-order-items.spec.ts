import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { EditProductUseCase } from './edit-product.ts'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'
import { makeProduct } from 'test/factories/make-product.ts'
import { FetchProductsUseCase } from './fetch-products.ts'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository.ts'
import { FetchOrderItemsUseCase } from './fetch-order-items.ts'
import { makeOrderItem } from 'test/factories/make-order-item.ts'
import { makeOrder } from 'test/factories/make-order.ts'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository.ts'

let ordersRepository: InMemoryOrdersRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let sut: FetchOrderItemsUseCase

describe('Fetch Order Items Use Case', () => {
	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository()
		orderItemsRepository = new InMemoryOrderItemsRepository()
		sut = new FetchOrderItemsUseCase(orderItemsRepository)
	})

	it('should be able to fetch order items', async () => {
		const order = makeOrder()
		ordersRepository.items.set(order.id.toValue(), order)

		const orderItem = makeOrderItem({ orderId: order.id })
		orderItemsRepository.items.set(orderItem.id.toValue(), orderItem)

		const orderItem2 = makeOrderItem({ orderId: order.id })
		orderItemsRepository.items.set(orderItem2.id.toValue(), orderItem2)

		const result = await sut.execute({
			orderId: order.id.toValue(),
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.orderItems).toMatchObject([
			{
				id: orderItem.id,
			},
			{
				id: orderItem2.id,
			},
		])
	})

	it('should be able to fetch paginated products', async () => {
		const order = makeOrder()
		ordersRepository.items.set(order.id.toValue(), order)

		for (let i = 1; i <= 12; i++) {
			const orderItem = makeOrderItem({ orderId: order.id }, new UniqueEntityId(`order-item-${i}`))
			orderItemsRepository.items.set(orderItem.id.toValue(), orderItem)
		}

		const result = await sut.execute({
			orderId: order.id.toValue(),
			page: 2,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.orderItems).toMatchObject([
			{
				id: {
					value: 'order-item-11',
				},
			},
			{
				id: {
					value: 'order-item-12',
				},
			},
		])
	})
})
