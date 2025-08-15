import { right, type Either } from '@/core/either'
import type { OrderItem } from '../../enterprise/entities/order-item.ts'
import { OrderItemsRepository } from '../repositories/order-items-repository.js'
import { Inject, Injectable } from '@nestjs/common'

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

@Injectable()
export class FetchOrderItemsUseCase {
	constructor(@Inject(OrderItemsRepository) private orderItemsRepository: OrderItemsRepository) {}

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
