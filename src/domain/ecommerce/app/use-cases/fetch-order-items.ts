import { right, type Either } from '@/core/either.ts'
import type { ProductsRepository } from '../repositories/products-repository.ts'
import type { OrderItem } from '../../enterprise/entities/order-item.ts'
import type { OrderItemsRepository } from '../repositories/order-items-repository.ts'

export interface FetchOrderItemsUseCaseRequest {
	orderId: string
	page?: number
}

type FetchOrderItemsUseCaseResponse = Either<
	null,
	{
		orderItems: OrderItem[]
	}
>

export class FetchOrderItemsUseCase {
	constructor(private orderItemsRepository: OrderItemsRepository) {}

	async execute({
		orderId,
		page,
	}: FetchOrderItemsUseCaseRequest): Promise<FetchOrderItemsUseCaseResponse> {
		const orderItems = await this.orderItemsRepository.findManyByOrderId({ orderId, page })

		return right({
			orderItems,
		})
	}
}
