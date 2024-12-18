import type { OrderItemsRepository } from '../repositories/order-items-repository.ts'
import type { OrdersRepository } from '../repositories/orders-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'
import { left, right, type Either } from '@/core/either.ts'

interface RemoveOrderItemUseCaseRequest {
	id: string
}

type RemoveOrderItemUseCaseResponse = Either<ResourceNotFoundError, null>

export class RemoveOrderItemUseCase {
	constructor(
		private ordersRepository: OrdersRepository,
		private orderItemsRepository: OrderItemsRepository
	) {}

	async execute({ id }: RemoveOrderItemUseCaseRequest): Promise<RemoveOrderItemUseCaseResponse> {
		const orderItem = await this.orderItemsRepository.findById(id)
		if (!orderItem) return left(new ResourceNotFoundError('Order item not found.'))

		const order = await this.ordersRepository.findById(orderItem.orderId.toValue())
		if (!order) return left(new ResourceNotFoundError('Order not found.'))

		order.totalPrice -= orderItem.price * orderItem.quantity

		await this.orderItemsRepository.delete(orderItem)
		await this.ordersRepository.save(order)

		return right(null)
	}
}
