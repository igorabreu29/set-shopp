import type { ProductsRepository } from '@/domain/ecommerce/app/repositories/products-repository.ts'
import type { Product } from '@/domain/ecommerce/enterprise/entities/product.ts'

export class InMemoryProductsRepository implements ProductsRepository {
	public items = new Map<string, Product>()

	async findById(id: string): Promise<Product | null> {
		const product = this.items.get(id)
		return product ?? null
	}

	async findByName(name: string): Promise<Product | null> {
		const product = this.items.get(name)
		return product ?? null
	}

	async findMany(page?: number): Promise<Product[]> {
		const PER_PAGE = 30

		const products = Array.from(this.items.values())

		if (page) {
			return products.slice((page - 1) * PER_PAGE, page * PER_PAGE)
		}

		return products
	}

	async create(product: Product): Promise<void> {
		this.items.set(product.id.toValue(), product)
	}

	async createMany(products: Product[]): Promise<void> {
		for (const product of products) {
			this.items.set(product.id.toValue(), product)
		}
	}

	async save(product: Product): Promise<void> {
		this.items.set(product.id.toValue(), product)
	}

	async delete(product: Product): Promise<void> {
		this.items.delete(product.id.toValue())
	}
}
