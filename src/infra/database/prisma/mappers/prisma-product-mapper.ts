import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Product } from '@/domain/ecommerce/enterprise/entities/product'
import { Name } from '@/domain/ecommerce/enterprise/entities/value-objects/name'
import { Prisma, type Product as PrismaProduct } from '@prisma/client'

export class PrismaProductMapper {
	static toDomain(raw: PrismaProduct): Product {
		const nameOrError = Name.create(raw.name)
		if (nameOrError.isLeft()) throw nameOrError.value

		const productOrError = Product.create(
			{
				name: nameOrError.value,
				description: raw.description,
				price: Number(raw.price),
				priceId: raw.priceId,
				productUrl: raw.productUrl ?? undefined,
			},
			new UniqueEntityId(raw.id)
		)

		if (productOrError.isLeft()) throw productOrError.value
		const product = productOrError.value

		return product
	}

	static toPrisma(product: Product): PrismaProduct {
		return {
			id: product.id.toValue(),
			name: product.name.value,
			description: product.description,
			productUrl: product.productUrl ?? null,
			price: new Prisma.Decimal(product.price),
			priceId: product.priceId,
		}
	}
}
