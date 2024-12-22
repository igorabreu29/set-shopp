import type { Optional } from '@/core/types/optional.ts'

export interface StoreProduct {
	id: string
	name: string
	description: string
	price: number
	priceId: string
	imageUrl?: string
}

export interface Checkout {
	priceId: string
	quantity: number
}

export interface StoreProducts {
	getById(id: string): Promise<StoreProduct | null>
	fetch(): Promise<StoreProduct[]>
	create(product: Optional<StoreProduct, 'id' | 'priceId'>): Promise<void>
	checkout(products: Checkout[]): Promise<{
		checkoutUrl: string
	}>
}
