import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'

export interface OrderItemProps {
	orderId: UniqueEntityId
	productId: UniqueEntityId
	quantity: number
	price: number
	priceId: string
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
	set quantity(quantity) {
		this.props.quantity = quantity
	}

	get price() {
		return this.props.price
	}
	set price(price) {
		this.props.price = price
	}

	get priceId() {
		return this.props.priceId
	}

	static create(props: OrderItemProps, id?: UniqueEntityId) {
		const orders = new OrderItem(props, id)

		return orders
	}
}
