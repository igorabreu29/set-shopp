import type { Optional } from '@/core/types/optional.ts'
import type { StoreProduct, StoreProducts } from '@/domain/ecommerce/app/store/store.ts'
import { randomUUID } from 'node:crypto'

export class FakeStoreProduct implements StoreProducts {
	public items = new Map<string, StoreProduct>()

	async getById(id: string): Promise<StoreProduct | null> {
		const product = this.items.get(id)
		return product ?? null
	}

	async fetch(): Promise<StoreProduct[]> {
		const products: StoreProduct[] = [
			{
				id: '1',
				name: 'product-1',
				description: 'description-1',
				imageUrl: '',
				price: 15,
			},
			{
				id: '2',
				name: 'product-2',
				description: 'description-2',
				imageUrl: '',
				price: 20,
			},
		]

		return products
	}

	async create(product: Optional<StoreProduct, 'id'>): Promise<void> {
		const productCreated = {
			id: product.id ?? randomUUID(),
			...product,
		}

		this.items.set(productCreated.id, productCreated)
	}
}
