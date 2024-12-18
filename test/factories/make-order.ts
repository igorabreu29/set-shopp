import { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'
import { Order } from '@/domain/ecommerce/enterprise/entities/order.ts'

export function makeOrder(override: Partial<Order> = {}, id?: UniqueEntityId) {
	const order = Order.create(
		{
			customerId: new UniqueEntityId(),
			totalPrice: 0,
			...override,
		},
		id
	)

	return order
}
