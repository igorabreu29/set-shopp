import { Name } from '@/domain/ecommerce/enterprise/entities/value-objects/name.ts'
import { faker } from '@faker-js/faker'

export function makeName(name?: string) {
	const nameOrError = Name.create(name ?? faker.book.title())
	if (nameOrError.isLeft()) throw new Error(nameOrError.value.message)

	return nameOrError.value
}
