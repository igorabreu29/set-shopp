import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository.ts'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'
import { makeOrder } from 'test/factories/make-order.ts'
import { makeOrderItem } from 'test/factories/make-order-item.ts'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'
import { DecreaseOrderItemQuantityUseCase } from './decrease-order-item-quantity.ts'

let ordersRepository: InMemoryOrdersRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let sut: DecreaseOrderItemQuantityUseCase

describe('Decrease Order Item Quantity Use Case', () => {
	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository()
		orderItemsRepository = new InMemoryOrderItemsRepository()

		sut = new DecreaseOrderItemQuantityUseCase(ordersRepository, orderItemsRepository)
	})

	it('should receive instance of "ResourceNotFoundError" if order item does not exist', async () => {
		const result = await sut.execute({
			id: 'not-found',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should remove order item if quantity is equal 1', async () => {
		const order = makeOrder({ customerId: new UniqueEntityId('customer-1'), totalPrice: 60 })
		ordersRepository.items.set(order.id.toValue(), order)

		const orderItem = makeOrderItem({
			orderId: order.id,
			productId: new UniqueEntityId(),
			price: 20,
			quantity: 1,
		})
		orderItemsRepository.items.set(orderItem.id.toValue(), orderItem)

		const result = await sut.execute({
			id: orderItem.id.toValue(),
		})

		expect(result.isRight()).toBe(true)
		expect(orderItemsRepository.items.size).toEqual(0)
	})

	it('should be able to decrease order item quantity', async () => {
		const order = makeOrder({ customerId: new UniqueEntityId('customer-1'), totalPrice: 60 })
		ordersRepository.items.set(order.id.toValue(), order)

		const orderItem = makeOrderItem({
			orderId: order.id,
			productId: new UniqueEntityId(),
			price: 60,
			quantity: 3,
		})
		orderItemsRepository.items.set(orderItem.id.toValue(), orderItem)

		const result = await sut.execute({
			id: orderItem.id.toValue(),
		})

		const orderItemUpdated = Array.from(orderItemsRepository.items.values())[0]
		const orderUpdated = Array.from(ordersRepository.items.values())[0]

		const expected = {
			quantity: 2,
			totalPrice: 40,
		}

		expect(result.isRight()).toBe(true)
		expect(orderItemUpdated.quantity).toEqual(expected.quantity)
		expect(orderUpdated.totalPrice).toEqual(expected.totalPrice)
	})
})
