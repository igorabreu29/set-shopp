import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'

export interface OrderProps {
	customerId: UniqueEntityId
	totalPrice: number
	createdAt: Date
	updatedAt: Date
}

export class Order extends Entity<OrderProps> {
	get customerId() {
		return this.props.customerId
	}

	get totalPrice() {
		return this.props.totalPrice
	}
	set totalPrice(totalPrice) {
		this.props.totalPrice = totalPrice
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	static create(props: Optional<OrderProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
		const order = new Order(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id
		)

		return order
	}
}
