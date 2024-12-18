import type { OrdersRepository } from '@/domain/ecommerce/app/repositories/orders-repository.ts'
import type { Order } from '@/domain/ecommerce/enterprise/entities/order.ts'

export class InMemoryOrdersRepository implements OrdersRepository {
	public items = new Map<string, Order>()

	async findById(id: string): Promise<Order | null> {
		const order = this.items.get(id)
		return order ?? null
	}

	async findByCustomerId(customerId: string): Promise<Order | null> {
		const order = this.items.get(customerId)
		return order ?? null
	}

	async create(order: Order): Promise<Order> {
		this.items.set(order.id.toValue(), order)
		return order
	}

	async save(order: Order): Promise<void> {
		this.items.set(order.customerId.toValue(), order)
	}
}
