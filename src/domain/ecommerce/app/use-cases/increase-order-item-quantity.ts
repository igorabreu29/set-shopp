import { Inject, Injectable } from '@nestjs/common'
import { OrderItemsRepository } from '../repositories/order-items-repository'
import { OrdersRepository } from '../repositories/orders-repository'
import { MaxLimitSizeError } from './errors/max-limit-size'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { left, right, type Either } from '@/core/either'

interface IncreaseOrderItemQuantityUseCaseRequest {
	orderId: string
	id: string
}

type IncreaseOrderItemQuantityUseCaseResponse = Either<
	ResourceNotFoundError | MaxLimitSizeError,
	null
>

@Injectable()
export class IncreaseOrderItemQuantityUseCase {
	constructor(
		@Inject(OrdersRepository)
		private ordersRepository: OrdersRepository,
		@Inject(OrderItemsRepository)
		private orderItemsRepository: OrderItemsRepository
	) {}

	async execute({
		orderId,
		id,
	}: IncreaseOrderItemQuantityUseCaseRequest): Promise<IncreaseOrderItemQuantityUseCaseResponse> {
		const order = await this.ordersRepository.findById(orderId)
		if (!order) return left(new ResourceNotFoundError('Order not found.'))

		const orderItem = await this.orderItemsRepository.findById(id)
		if (!orderItem) return left(new ResourceNotFoundError('Order item not found.'))

		if (orderItem.quantity === 10) {
			return left(new MaxLimitSizeError('Max quantity size.'))
		}

		order.totalPrice -= orderItem.price

		orderItem.quantity += 1
		order.totalPrice += orderItem.price * orderItem.quantity

		await this.orderItemsRepository.save(orderItem)
		await this.ordersRepository.save(order)

		return right(null)
	}
}
