import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import type { Email } from './value-objects/email'
import type { Name } from './value-objects/name'
import { right, type Either } from '@/core/either'
import type { InvalidNameError } from '@/core/errors/domain/invalid-name-error'
import type { InvalidEmailError } from '@/core/errors/domain/invalid-email-error'

export interface CustomerProps {
	name: Name
	email: Email
	customerUrl: string
	createdAt: Date
}

export class Customer extends Entity<CustomerProps> {
	get name() {
		return this.props.name
	}

	get email() {
		return this.props.email
	}

	get customerUrl() {
		return this.props.customerUrl
	}

	static create(
		props: Optional<CustomerProps, 'createdAt'>,
		id?: UniqueEntityId
	): Either<InvalidNameError | InvalidEmailError, Customer> {
		const customer = new Customer(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		)
		return right(customer)
	}
}
