import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'

interface ProductProps {
	name: string
	description: string
	price: number
	productUrl: string
}

export class Product extends Entity<ProductProps> {
	get name() {
		return this.props.name
	}

	get description() {
		return this.props.description
	}

	get price() {
		return this.props.price
	}

	get productUrl() {
		return this.props.productUrl
	}

	static create(props: ProductProps, id?: UniqueEntityId) {
		const product = new Product(props, id)
		return product
	}
}
