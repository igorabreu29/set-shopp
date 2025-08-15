import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { makeOrder } from 'test/factories/make-order'
import { makeOrderItem } from 'test/factories/make-order-item'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { IncreaseOrderItemQuantityUseCase } from './increase-order-item-quantity'
import { MaxLimitSizeError } from './errors/max-limit-size'

let ordersRepository: InMemoryOrdersRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let sut: IncreaseOrderItemQuantityUseCase

describe('Increase Order Item Quantity Use Ca', () => {
	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository()
		orderItemsRepository = new InMemoryOrderItemsRepository()

		sut = new IncreaseOrderItemQuantityUseCase(ordersRepository, orderItemsRepository)
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

	it('should receive instance of "MaxLimitSizeError" if order item quantity is 10', async () => {
		const order = makeOrder({ customerId: new UniqueEntityId('customer-1'), totalPrice: 10 })
		ordersRepository.create(order)

		const orderItem = makeOrderItem({
			orderId: order.id,
			productId: new UniqueEntityId(),
			price: 10,
			quantity: 10,
		})
		orderItemsRepository.items.set(orderItem.id.toValue(), orderItem)

		const result = await sut.execute({
			orderId: order.id.toValue(),
			id: orderItem.id.toValue(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(MaxLimitSizeError)
	})

	it('should be able to inscrease order item quantity', async () => {
		const order = makeOrder({ customerId: new UniqueEntityId('customer-1'), totalPrice: 10 })
		ordersRepository.create(order)

		const orderItem = makeOrderItem({
			orderId: order.id,
			productId: new UniqueEntityId(),
			price: 10,
			quantity: 1,
		})
		orderItemsRepository.items.set(orderItem.id.toValue(), orderItem)

		const result = await sut.execute({
			orderId: order.id.toValue(),
			id: orderItem.id.toValue(),
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
})
