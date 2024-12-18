import type {
	FindByOrderAndProductIdProps,
	FindManyByOrderIdWithPaginated,
	OrderItemsRepository,
} from '@/domain/ecommerce/app/repositories/order-items-repository.ts'
import type { OrderItem } from '@/domain/ecommerce/enterprise/entities/order-item.ts'

export class InMemoryOrderItemsRepository implements OrderItemsRepository {
	public items = new Map<string, OrderItem>()

	async findById(id: string): Promise<OrderItem | null> {
		const orderItem = this.items.get(id)
		return orderItem ?? null
	}

	async findByOrderAndProductId({
		orderId,
		productId,
	}: FindByOrderAndProductIdProps): Promise<OrderItem | null> {
		const orderItems = Array.from(this.items.values())
		const orderItem = orderItems.find(item => {
			return item.orderId.toValue() === orderId && item.productId.toValue() === productId
		})

		return orderItem ?? null
	}

	async findManyByOrderId({ orderId, page }: FindManyByOrderIdWithPaginated): Promise<OrderItem[]> {
		const PER_PAGE = 10

		const orderItems = Array.from(this.items.values()).filter(
			item => item.orderId.toValue() === orderId
		)

		if (page) {
			return orderItems.slice((page - 1) * PER_PAGE, page * PER_PAGE)
		}

		return orderItems
	}

	async create(orderItem: OrderItem): Promise<void> {
		this.items.set(orderItem.id.toValue(), orderItem)
	}

	async save(orderItem: OrderItem): Promise<void> {
		this.items.set(orderItem.id.toValue(), orderItem)
	}

	async delete(orderItem: OrderItem): Promise<void> {
		this.items.delete(orderItem.id.toValue())
	}
}
