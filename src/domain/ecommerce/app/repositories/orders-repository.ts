import type { Order } from '../../enterprise/entities/order'

export abstract class OrdersRepository {
	abstract findById(id: string): Promise<Order | null>
	abstract findByCustomerId(customerId: string): Promise<Order | null>
	abstract create(order: Order): Promise<Order>
	abstract save(order: Order): Promise<void>
}
