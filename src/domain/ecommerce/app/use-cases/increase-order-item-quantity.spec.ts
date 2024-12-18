import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository.ts'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'
import { makeOrder } from 'test/factories/make-order.ts'
import { makeOrderItem } from 'test/factories/make-order-item.ts'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'
import { IncreaseOrderItemQuantityUseCase } from './increase-order-item-quantity.ts'
import { MaxLimitSizeError } from './errors/max-limit-size.ts'

let ordersRepository: InMemoryOrdersRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let sut: IncreaseOrderItemQuantityUseCase

describe('Increase Order Item Quantity Use Ca', () => {
	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository()
		orderItemsRepository = new InMemoryOrderItemsRepository()

		sut = new IncreaseOrderItemQuantityUseCase(ordersRepository, orderItemsRepository)
	})

	it('should receive instance of "ResourceNotFoundError" if order item does not exist', async () => {
		const result = await sut.execute({
			id: 'not-found',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should receive instance of "MaxLimitSizeError" if order item quantity is 10', async () => {
		const order = makeOrder({ customerId: new UniqueEntityId('customer-1'), totalPrice: 10 })
		ordersRepository.items.set(order.id.toValue(), order)

		const orderItem = makeOrderItem({
			orderId: order.id,
			productId: new UniqueEntityId(),
			price: 10,
			quantity: 10,
		})
		orderItemsRepository.items.set(orderItem.id.toValue(), orderItem)

		const result = await sut.execute({
			id: orderItem.id.toValue(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(MaxLimitSizeError)
	})

	it('should be able to inscrease order item quantity', async () => {
		const order = makeOrder({ customerId: new UniqueEntityId('customer-1'), totalPrice: 10 })
		ordersRepository.items.set(order.id.toValue(), order)

		const orderItem = makeOrderItem({
			orderId: order.id,
			productId: new UniqueEntityId(),
			price: 10,
			quantity: 1,
		})
		orderItemsRepository.items.set(orderItem.id.toValue(), orderItem)

		const result = await sut.execute({
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
