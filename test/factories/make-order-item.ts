import { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'
import { OrderItem } from '@/domain/ecommerce/enterprise/entities/order-item.ts'

export function makeOrderItem(override: Partial<OrderItem> = {}, id?: UniqueEntityId) {
	const orderItem = OrderItem.create(
		{
			orderId: new UniqueEntityId(),
			productId: new UniqueEntityId(),
			price: 0,
			quantity: 0,
			...override,
		},
		id
	)

	return orderItem
}
