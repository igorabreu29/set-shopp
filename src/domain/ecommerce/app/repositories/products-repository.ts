import type { Product } from '../../enterprise/entities/product'

export abstract class ProductsRepository {
	abstract findById(id: string): Promise<Product | null>
	abstract findByName(name: string): Promise<Product | null>
	abstract findMany(page?: number): Promise<Product[]>
	abstract create(product: Product): Promise<void>
	abstract createMany(products: Product[]): Promise<void>
	abstract save(product: Product): Promise<void>
	abstract delete(product: Product): Promise<void>
}
