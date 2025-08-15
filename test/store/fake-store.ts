import type { Optional } from '@/core/types/optional.ts'
import type {
	Checkout,
	Session,
	StoreProduct,
	StoreProducts,
} from '@/domain/ecommerce/app/store/store.ts'
import { randomUUID } from 'node:crypto'

export class FakeStoreProduct implements StoreProducts {
	public items = new Map<string, StoreProduct>()

	async findById(id: string): Promise<StoreProduct | null> {
		const product = this.items.get(id)
		return product ?? null
	}

	async findMany(): Promise<StoreProduct[]> {
		const products: StoreProduct[] = [
			{
				id: '1',
				priceId: 'price_test_1',
				name: 'product-1',
				description: 'description-1',
				imageUrl: '',
				price: 15,
			},
			{
				id: '2',
				priceId: 'price_test_2',
				name: 'product-2',
				description: 'description-2',
				imageUrl: '',
				price: 20,
			},
		]

		return products
	}

	async findManyBySessionId(sessionId: string): Promise<Session> {
		const items = [
			{
				sessionId: 'session',
				customerName: 'customer_test',
				products: [
					{
						id: '1',
						priceId: 'price_test_1',
						name: 'product-1',
						description: 'description-1',
						imageUrl: '',
						price: 15,
					},
					{
						id: '2',
						priceId: 'price_test_2',
						name: 'product-2',
						description: 'description-2',
						imageUrl: '',
						price: 15,
					},
				],
			},
		]

		const session = items.filter(item => item.sessionId === sessionId)[0]

		return session
	}

	async create(product: Optional<StoreProduct, 'id' | 'priceId'>): Promise<void> {
		const productCreated = {
			id: product.id ?? randomUUID(),
			priceId: product.priceId ?? `price_test_${randomUUID()}`,
			...product,
		}

		this.items.set(productCreated.id, productCreated)
	}

	async save(product: Optional<StoreProduct, 'priceId'>): Promise<void> {
		const productUpdated = {
			priceId: product.priceId ?? `price_test_${randomUUID()}`,
			...product,
		}

		this.items.set(productUpdated.id, productUpdated)
	}

	async delete(id: string): Promise<void> {
		this.items.delete(id)
	}

	async checkout(products: Checkout[]): Promise<{ checkoutUrl: string }> {
		return {
			checkoutUrl: 'fake-url',
		}
	}
}
