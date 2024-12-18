import type { UniqueEntityId } from '@/core/entities/unique-entity-id.ts'
import { Product } from '@/domain/ecommerce/enterprise/entities/product.ts'
import { Name } from '@/domain/ecommerce/enterprise/entities/value-objects/name.ts'
import { faker } from '@faker-js/faker'

export function makeProduct(override: Partial<Product> = {}, id?: UniqueEntityId) {
	const nameOrError = Name.create(faker.book.title())
	if (nameOrError.isLeft()) throw new Error(nameOrError.value.message)

	const productOrError = Product.create(
		{
			name: nameOrError.value,
			description: faker.book.series(),
			price: faker.number.int(),
			productUrl: faker.internet.url(),
			...override,
		},
		id
	)
	if (productOrError.isLeft()) throw new Error(productOrError.value.message)

	return productOrError.value
}
