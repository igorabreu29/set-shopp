import type { OrderItem } from '@/domain/ecommerce/enterprise/entities/order-item'

export class OrderItemPresenter {
	static toHTTP(orderItem: OrderItem) {
		return {
			id: orderItem.id.toValue(),
			quantity: orderItem.quantity,
			price: orderItem.price,
		}
	}
}
