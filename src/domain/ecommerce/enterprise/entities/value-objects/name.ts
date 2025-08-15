import { type Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'
import { InvalidNameError } from '@/core/errors/domain/invalid-name-error'

interface NameProps {
	name: string
}

export class Name extends ValueObject<NameProps> {
	get value(): string {
		return this.props.name
	}

	public static validate(name: string): boolean {
		if (!name || name.trim().length > 255) {
			return false
		}

		return true
	}

	static create(name: string): Either<InvalidNameError, Name> {
		if (!Name.validate(name)) {
			return left(new InvalidNameError())
		}

		return right(new Name({ name }))
	}
}
