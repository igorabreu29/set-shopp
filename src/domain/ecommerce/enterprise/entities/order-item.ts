import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'

export interface OrderItemProps {
	orderId: string
	productId: string
	quantity: number
	price: number
}

export class OrderItem extends Entity<OrderItemProps> {
	get orderId() {
		return this.props.orderId
	}

	get productId() {
		return this.props.productId
	}

	get quantity() {
		return this.props.quantity
	}

	get price() {
		return this.props.price
	}

	static create(props: OrderItemProps, id?: UniqueEntityId) {
		const orders = new OrderItem(props, id)

		return orders
	}
}
