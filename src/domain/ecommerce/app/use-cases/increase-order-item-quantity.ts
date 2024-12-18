import type { OrderItemsRepository } from '../repositories/order-items-repository.ts'
import type { OrdersRepository } from '../repositories/orders-repository.ts'
import { MaxLimitSizeError } from './errors/max-limit-size.ts'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'
import { left, right, type Either } from '@/core/either.ts'

interface IncreaseOrderItemQuantityUseCaseRequest {
	id: string
}

type IncreaseOrderItemQuantityUseCaseResponse = Either<
	ResourceNotFoundError | MaxLimitSizeError,
	null
>

export class IncreaseOrderItemQuantityUseCase {
	constructor(
		private ordersRepository: OrdersRepository,
		private orderItemsRepository: OrderItemsRepository
	) {}

	async execute({
		id,
	}: IncreaseOrderItemQuantityUseCaseRequest): Promise<IncreaseOrderItemQuantityUseCaseResponse> {
		const orderItem = await this.orderItemsRepository.findById(id)
		if (!orderItem) return left(new ResourceNotFoundError('Order item not found.'))

		const order = await this.ordersRepository.findById(orderItem.orderId.toValue())
		if (!order) return left(new ResourceNotFoundError('Order not found.'))

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
