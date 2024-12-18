import type { Product } from '../../enterprise/entities/product.ts'

export interface ProductsRepository {
	findById(id: string): Promise<Product | null>
	findByName(name: string): Promise<Product | null>
	findMany(page?: number): Promise<Product[]>
	create(product: Product): Promise<void>
	createMany(products: Product[]): Promise<void>
	save(product: Product): Promise<void>
	delete(product: Product): Promise<void>
}
