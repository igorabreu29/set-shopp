import type { OrderItemsRepository } from '../repositories/order-items-repository.ts'
import type { OrdersRepository } from '../repositories/orders-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'
import { left, right, type Either } from '@/core/either.ts'

interface DecreaseOrderItemQuantityUseCaseRequest {
	id: string
}

type DecreaseOrderItemQuantityUseCaseResponse = Either<ResourceNotFoundError, null>

export class DecreaseOrderItemQuantityUseCase {
	constructor(
		private ordersRepository: OrdersRepository,
		private orderItemsRepository: OrderItemsRepository
	) {}

	async execute({
		id,
	}: DecreaseOrderItemQuantityUseCaseRequest): Promise<DecreaseOrderItemQuantityUseCaseResponse> {
		const orderItem = await this.orderItemsRepository.findById(id)
		if (!orderItem) return left(new ResourceNotFoundError('Order item not found.'))

		const order = await this.ordersRepository.findById(orderItem.orderId.toValue())
		if (!order) return left(new ResourceNotFoundError('Order not found.'))

		if (orderItem.quantity === 1) {
			await this.orderItemsRepository.delete(orderItem)
			return right(null)
		}

		order.totalPrice -= orderItem.price / orderItem.quantity
		orderItem.quantity -= 1

		await this.orderItemsRepository.save(orderItem)
		await this.ordersRepository.save(order)

		return right(null)
	}
}
