import type { ProductsRepository } from '@/domain/ecommerce/app/repositories/products-repository'
import { PrismaService } from '../prisma.service'
import type { Product } from '@/domain/ecommerce/enterprise/entities/product'
import { PrismaProductMapper } from '../mappers/prisma-product-mapper'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
	constructor(
		@Inject(PrismaService)
		private prisma: PrismaService
	) {}

	async findById(id: string): Promise<Product | null> {
		const product = await this.prisma.product.findUnique({
			where: {
				id,
			},
		})
		if (!product) return null

		return PrismaProductMapper.toDomain(product)
	}

	async findByName(name: string): Promise<Product | null> {
		const product = await this.prisma.product.findFirst({
			where: {
				name,
			},
		})
		if (!product) return null

		return PrismaProductMapper.toDomain(product)
	}

	async findMany(page?: number): Promise<Product[]> {
		const PER_PAGE = 10

		const products = await this.prisma.product.findMany({
			take: page ? PER_PAGE : undefined,
			skip: page ? (page - 1) * PER_PAGE : undefined,
		})

		return products.map(PrismaProductMapper.toDomain)
	}

	async create(product: Product): Promise<void> {
		const raw = PrismaProductMapper.toPrisma(product)

		await this.prisma.product.create({ data: raw })
	}

	async createMany(products: Product[]): Promise<void> {
		const raws = products.map(PrismaProductMapper.toPrisma)

		await this.prisma.product.createMany({ data: raws })
	}

	async save(product: Product): Promise<void> {
		const raw = PrismaProductMapper.toPrisma(product)

		await this.prisma.product.update({
			where: {
				id: raw.id,
			},
			data: raw,
		})
	}

	async delete(product: Product): Promise<void> {
		const raw = PrismaProductMapper.toPrisma(product)

		await this.prisma.product.delete({
			where: {
				id: raw.id,
			},
		})
	}
}
