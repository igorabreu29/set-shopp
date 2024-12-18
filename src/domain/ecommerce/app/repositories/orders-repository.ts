import type { Order } from '../../enterprise/entities/order.ts'

export interface OrdersRepository {
	findById(id: string): Promise<Order | null>
	findByCustomerId(customerId: string): Promise<Order | null>
	create(order: Order): Promise<Order>
	save(order: Order): Promise<void>
}
