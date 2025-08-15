import type { OrderItem } from '../../enterprise/entities/order-item'

export interface FindByOrderAndProductIdProps {
	orderId: string
	productId: string
}

export interface FindManyByOrderIdWithPaginated {
	orderId: string
	page?: number
}

export abstract class OrderItemsRepository {
	abstract findById(id: string): Promise<OrderItem | null>
	abstract findByOrderAndProductId({
		orderId,
		productId,
	}: FindByOrderAndProductIdProps): Promise<OrderItem | null>
	abstract findManyByOrderId({
		orderId,
		page,
	}: FindManyByOrderIdWithPaginated): Promise<OrderItem[]>
	abstract create(orderItem: OrderItem): Promise<void>
	abstract save(orderItem: OrderItem): Promise<void>
	abstract delete(orderItem: OrderItem): Promise<void>
}
