import type { OrderItem } from '../../enterprise/entities/order-item.ts'

export interface FindByOrderAndProductIdProps {
	orderId: string
	productId: string
}

export interface FindManyByOrderIdWithPaginated {
	orderId: string
	page?: number
}

export interface OrderItemsRepository {
	findById(id: string): Promise<OrderItem | null>
	findByOrderAndProductId({
		orderId,
		productId,
	}: FindByOrderAndProductIdProps): Promise<OrderItem | null>
	findManyByOrderId({ orderId, page }: FindManyByOrderIdWithPaginated): Promise<OrderItem[]>
	create(orderItem: OrderItem): Promise<void>
	save(orderItem: OrderItem): Promise<void>
	delete(orderItem: OrderItem): Promise<void>
}
