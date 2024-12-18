import { right, type Either } from '@/core/either.ts'
import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'
import type { InvalidNameError } from '@/core/errors/domain/invalid-name-error.ts'
import type { Name } from './value-objects/name.ts'

interface ProductProps {
	name: Name
	description: string
	price: number
	productUrl?: string
}

export class Product extends Entity<ProductProps> {
	get name() {
		return this.props.name
	}
	set name(name) {
		this.props.name = name
	}

	get description() {
		return this.props.description
	}
	set description(description) {
		this.props.description = description
	}

	get price() {
		return this.props.price
	}
	set price(price) {
		this.props.price = price
	}

	get productUrl() {
		return this.props.productUrl
	}
	set productUrl(productUrl) {
		this.props.productUrl = productUrl
	}

	static create(props: ProductProps, id?: UniqueEntityId): Either<InvalidNameError, Product> {
		const product = new Product(props, id)
		return right(product)
	}
}
