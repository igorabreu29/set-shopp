import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { makeOrder } from 'test/factories/make-order'
import { makeOrderItem } from 'test/factories/make-order-item'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { RemoveOrderItemUseCase } from './remove-order-item'

let ordersRepository: InMemoryOrdersRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let sut: RemoveOrderItemUseCase

describe('Delete Order Item Use Case', () => {
	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository()
		orderItemsRepository = new InMemoryOrderItemsRepository()

		sut = new RemoveOrderItemUseCase(ordersRepository, orderItemsRepository)
	})

	it('should receive instance of "ResourceNotFoundError" if order does not exist', async () => {
		const result = await sut.execute({
			orderId: 'not-found',
			id: '',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should receive instance of "ResourceNotFoundError" if order item does not exist', async () => {
		const order = makeOrder()
		ordersRepository.create(order)

		const result = await sut.execute({
			orderId: order.id.toValue(),
			id: 'not-found',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should be able to delete order item', async () => {
		const order = makeOrder({ customerId: new UniqueEntityId('customer-1'), totalPrice: 70 })
		ordersRepository.create(order)

		const orderItem = makeOrderItem({
			orderId: order.id,
			productId: new UniqueEntityId(),
			price: 20,
			quantity: 2,
		})
		orderItemsRepository.create(orderItem)

		const orderItem2 = makeOrderItem({
			orderId: order.id,
			productId: new UniqueEntityId(),
			price: 30,
			quantity: 1,
		})
		orderItemsRepository.create(orderItem2)

		const result = await sut.execute({
			orderId: order.id.toValue(),
			id: orderItem.id.toValue(),
		})

		const orderUpdated = Array.from(ordersRepository.items.values())[0]

		const expected = {
			totalPrice: 30,
		}

		expect(result.isRight()).toBe(true)
		expect(orderUpdated.totalPrice).toEqual(expected.totalPrice)
	})
})
