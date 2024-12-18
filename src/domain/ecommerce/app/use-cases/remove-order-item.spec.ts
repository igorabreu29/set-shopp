import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository.ts'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'
import { makeOrder } from 'test/factories/make-order.ts'
import { makeOrderItem } from 'test/factories/make-order-item.ts'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'
import { IncreaseOrderItemQuantityUseCase } from './increase-order-item-quantity.ts'
import { MaxLimitSizeError } from './errors/max-limit-size.ts'
import { RemoveOrderItemUseCase } from './remove-order-item.ts'

let ordersRepository: InMemoryOrdersRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let sut: RemoveOrderItemUseCase

describe('Delete Order Item Use Case', () => {
	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository()
		orderItemsRepository = new InMemoryOrderItemsRepository()

		sut = new RemoveOrderItemUseCase(ordersRepository, orderItemsRepository)
	})

	it('should receive instance of "ResourceNotFoundError" if order item does not exist', async () => {
		const result = await sut.execute({
			id: 'not-found',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should be able to delete order item', async () => {
		const order = makeOrder({ customerId: new UniqueEntityId('customer-1'), totalPrice: 60 })
		ordersRepository.items.set(order.id.toValue(), order)

		const orderItem = makeOrderItem({
			orderId: order.id,
			productId: new UniqueEntityId(),
			price: 20,
			quantity: 2,
		})
		orderItemsRepository.items.set(orderItem.id.toValue(), orderItem)

		const result = await sut.execute({
			id: orderItem.id.toValue(),
		})

		const orderUpdated = Array.from(ordersRepository.items.values())[0]

		const expected = {
			totalPrice: 20,
		}

		expect(result.isRight()).toBe(true)
		expect(orderUpdated.totalPrice).toEqual(expected.totalPrice)
	})
})
