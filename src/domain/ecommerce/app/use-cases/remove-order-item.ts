import { Inject, Injectable } from '@nestjs/common'
import { OrderItemsRepository } from '../repositories/order-items-repository'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { left, right, type Either } from '@/core/either'

interface RemoveOrderItemUseCaseRequest {
	orderId: string
	id: string
}

type RemoveOrderItemUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class RemoveOrderItemUseCase {
	constructor(
		@Inject(OrdersRepository)
		private ordersRepository: OrdersRepository,
		@Inject(OrderItemsRepository)
		private orderItemsRepository: OrderItemsRepository
	) {}

	async execute({
		orderId,
		id,
	}: RemoveOrderItemUseCaseRequest): Promise<RemoveOrderItemUseCaseResponse> {
		const order = await this.ordersRepository.findById(orderId)
		if (!order) return left(new ResourceNotFoundError('Order not found.'))

		const orderItem = await this.orderItemsRepository.findById(id)
		if (!orderItem) return left(new ResourceNotFoundError('Order item not found.'))

		order.totalPrice -= orderItem.price * orderItem.quantity

		await this.orderItemsRepository.delete(orderItem)
		await this.ordersRepository.save(order)

		return right(null)
	}
}
