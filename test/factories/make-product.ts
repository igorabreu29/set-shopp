import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Product, type ProductProps } from '@/domain/ecommerce/enterprise/entities/product'
import { Name } from '@/domain/ecommerce/enterprise/entities/value-objects/name'
import { PrismaProductMapper } from '@/infra/database/prisma/mappers/prisma-product-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { da, faker } from '@faker-js/faker'
import { Inject, Injectable } from '@nestjs/common'

export function makeProduct(override: Partial<ProductProps> = {}, id?: UniqueEntityId) {
	const nameOrError = Name.create(faker.book.title())
	if (nameOrError.isLeft()) throw new Error(nameOrError.value.message)

	const productOrError = Product.create(
		{
			name: nameOrError.value,
			description: faker.book.series(),
			price: faker.number.int(),
			productUrl: faker.internet.url(),
			priceId: 'price_test',
			...override,
		},
		id
	)
	if (productOrError.isLeft()) throw new Error(productOrError.value.message)

	return productOrError.value
}

@Injectable()
export class ProductFactory {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async makePrismaProduct(data: Partial<ProductProps> = {}) {
		const product = makeProduct(data)
		const raw = PrismaProductMapper.toPrisma(product)

		await this.prisma.product.create({
			data: raw,
		})

		return product
	}
}
